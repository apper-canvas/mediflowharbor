import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import FormField from "@/components/molecules/FormField";
import Label from "@/components/atoms/Label";
import appointmentService from "@/services/api/appointmentService";
import { toast } from "react-toastify";
import { format, startOfWeek, endOfWeek, eachDayOfInterval, isSameDay, parseISO } from "date-fns";

const AppointmentsPage = () => {
  const [appointments, setAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [viewMode, setViewMode] = useState("list");
  const [selectedDate, setSelectedDate] = useState(new Date());
  const [showAddForm, setShowAddForm] = useState(false);
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [newAppointment, setNewAppointment] = useState({
    patientId: "",
    doctorId: "",
    department: "",
    dateTime: "",
    duration: 30,
    type: "",
    notes: ""
  });

  const departments = ["All", "Cardiology", "General Medicine", "Orthopedics", "Obstetrics", "Emergency"];

  const loadAppointments = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await appointmentService.getAll();
      setAppointments(data);
    } catch (err) {
      setError("Failed to load appointments");
      toast.error("Failed to load appointments");
    } finally {
      setLoading(false);
    }
  };

  const handleAddAppointment = async (e) => {
    e.preventDefault();
    try {
      await appointmentService.create(newAppointment);
      toast.success("Appointment scheduled successfully");
      setShowAddForm(false);
      setNewAppointment({
        patientId: "",
        doctorId: "",
        department: "",
        dateTime: "",
        duration: 30,
        type: "",
        notes: ""
      });
      loadAppointments();
    } catch (err) {
      toast.error("Failed to schedule appointment");
    }
  };

  const filteredAppointments = appointments.filter(appointment => {
    if (selectedDepartment !== "All" && appointment.department !== selectedDepartment) {
      return false;
    }
    return true;
  });

  const getWeekDays = () => {
    const start = startOfWeek(selectedDate, { weekStartsOn: 1 });
    const end = endOfWeek(selectedDate, { weekStartsOn: 1 });
    return eachDayOfInterval({ start, end });
  };

  const getAppointmentsForDate = (date) => {
    return filteredAppointments.filter(appointment =>
      isSameDay(parseISO(appointment.dateTime), date)
    );
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  if (loading) return <Loading variant="table" />;
  if (error) return <Error message={error} onRetry={loadAppointments} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Appointments
          </h1>
          <p className="text-gray-600 mt-2">
            Manage patient appointments and scheduling
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="CalendarPlus" size={16} className="mr-2" />
          Schedule Appointment
        </Button>
      </motion.div>

      {/* Controls */}
      <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-center justify-between">
        <div className="flex gap-2">
          <Button
            variant={viewMode === "list" ? "primary" : "outline"}
            onClick={() => setViewMode("list")}
            size="sm"
          >
            <ApperIcon name="List" size={16} className="mr-2" />
            List View
          </Button>
          <Button
            variant={viewMode === "calendar" ? "primary" : "outline"}
            onClick={() => setViewMode("calendar")}
            size="sm"
          >
            <ApperIcon name="Calendar" size={16} className="mr-2" />
            Calendar View
          </Button>
        </div>

        <div className="flex gap-2 flex-wrap">
          {departments.map(dept => (
            <button
              key={dept}
              onClick={() => setSelectedDepartment(dept)}
              className={`px-3 py-1 rounded-full text-sm font-medium transition-all duration-200 ${
                selectedDepartment === dept
                  ? "bg-gradient-to-r from-primary to-secondary text-white"
                  : "bg-gray-100 text-gray-600 hover:bg-gray-200"
              }`}
            >
              {dept}
            </button>
          ))}
        </div>
      </div>

      {/* Add Appointment Form Modal */}
      {showAddForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-2xl max-h-[90vh] overflow-y-auto"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">Schedule New Appointment</h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleAddAppointment} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <FormField
                  label="Patient ID"
                  required
                  placeholder="P001"
                  value={newAppointment.patientId}
                  onChange={(e) => setNewAppointment({...newAppointment, patientId: e.target.value})}
                />
                <FormField
                  label="Doctor ID"
                  required
                  placeholder="D001"
                  value={newAppointment.doctorId}
                  onChange={(e) => setNewAppointment({...newAppointment, doctorId: e.target.value})}
                />
                <div className="space-y-2">
                  <Label>Department *</Label>
                  <select
                    required
                    value={newAppointment.department}
                    onChange={(e) => setNewAppointment({...newAppointment, department: e.target.value})}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Department</option>
                    {departments.slice(1).map(dept => (
                      <option key={dept} value={dept}>{dept}</option>
                    ))}
                  </select>
                </div>
                <div className="space-y-2">
                  <Label>Appointment Type *</Label>
                  <select
                    required
                    value={newAppointment.type}
                    onChange={(e) => setNewAppointment({...newAppointment, type: e.target.value})}
                    className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  >
                    <option value="">Select Type</option>
                    <option value="Consultation">Consultation</option>
                    <option value="Check-up">Check-up</option>
                    <option value="Follow-up">Follow-up</option>
                    <option value="Surgery">Surgery</option>
                    <option value="Prenatal">Prenatal</option>
                  </select>
                </div>
                <FormField
                  label="Date & Time"
                  type="datetime-local"
                  required
                  value={newAppointment.dateTime}
                  onChange={(e) => setNewAppointment({...newAppointment, dateTime: e.target.value})}
                />
                <FormField
                  label="Duration (minutes)"
                  type="number"
                  min="15"
                  max="240"
                  value={newAppointment.duration}
                  onChange={(e) => setNewAppointment({...newAppointment, duration: parseInt(e.target.value)})}
                />
              </div>

              <div className="space-y-2">
                <Label>Notes</Label>
                <textarea
                  value={newAppointment.notes}
                  onChange={(e) => setNewAppointment({...newAppointment, notes: e.target.value})}
                  className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                  rows="3"
                  placeholder="Additional notes or instructions..."
                />
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Schedule Appointment
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Content based on view mode */}
      {viewMode === "list" ? (
        <Card>
          <CardHeader>
            <CardTitle>Appointments List</CardTitle>
          </CardHeader>
          <CardContent>
            {filteredAppointments.length === 0 ? (
              <Empty
                title="No appointments found"
                description="No appointments match your current filters"
                icon="Calendar"
                actionLabel="Schedule First Appointment"
                onAction={() => setShowAddForm(true)}
              />
            ) : (
              <div className="space-y-4">
                {filteredAppointments.map((appointment) => (
                  <motion.div
                    key={appointment.Id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-4">
                      <div className="w-12 h-12 bg-gradient-to-r from-accent to-cyan-600 rounded-lg flex items-center justify-center">
                        <ApperIcon name="Calendar" size={20} className="text-white" />
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{appointment.type}</p>
                        <p className="text-sm text-gray-600">{appointment.department}</p>
                        <p className="text-sm text-gray-500">
                          Patient: {appointment.patientId} | Doctor: {appointment.doctorId}
                        </p>
                        <p className="text-xs text-gray-400">
                          {format(parseISO(appointment.dateTime), "PPP p")} ({appointment.duration} min)
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-3">
                      <Badge variant="info">{appointment.status}</Badge>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Edit" size={16} />
                      </Button>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      ) : (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Weekly Calendar</span>
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() - 7 * 24 * 60 * 60 * 1000))}
                >
                  <ApperIcon name="ChevronLeft" size={16} />
                </Button>
                <span className="text-sm font-medium">
                  {format(selectedDate, "MMMM yyyy")}
                </span>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setSelectedDate(new Date(selectedDate.getTime() + 7 * 24 * 60 * 60 * 1000))}
                >
                  <ApperIcon name="ChevronRight" size={16} />
                </Button>
              </div>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-7 gap-4">
              {getWeekDays().map((day) => {
                const dayAppointments = getAppointmentsForDate(day);
                return (
                  <div key={day.toISOString()} className="min-h-[300px] border border-gray-200 rounded-lg p-3">
                    <h3 className="font-semibold text-center text-gray-900 mb-3">
                      {format(day, "EEE d")}
                    </h3>
                    <div className="space-y-2">
                      {dayAppointments.map((appointment) => (
                        <div
                          key={appointment.Id}
                          className="p-2 bg-gradient-to-r from-primary to-secondary text-white rounded text-xs"
                        >
                          <p className="font-medium">
                            {format(parseISO(appointment.dateTime), "HH:mm")}
                          </p>
                          <p className="truncate">{appointment.type}</p>
                          <p className="truncate opacity-80">{appointment.department}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default AppointmentsPage;