import React, { useEffect, useState } from "react";
import { motion } from "framer-motion";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/atoms/Card";
import { toast } from "react-toastify";
import bedService from "@/services/api/bedService";
import appointmentService from "@/services/api/appointmentService";
import patientService from "@/services/api/patientService";
import ApperIcon from "@/components/ApperIcon";
import StatsCard from "@/components/molecules/StatsCard";
import Error from "@/components/ui/Error";
import Loading from "@/components/ui/Loading";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";

const DashboardPage = () => {
  const [stats, setStats] = useState(null);
  const [recentPatients, setRecentPatients] = useState([]);
  const [todaysAppointments, setTodaysAppointments] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const loadDashboardData = async () => {
    try {
      setLoading(true);
      setError("");

      const [patients, beds, appointments] = await Promise.all([
        patientService.getAll(),
        bedService.getAll(),
        appointmentService.getTodaysAppointments()
      ]);

const occupiedBeds = beds.filter(bed => (bed.status_c || bed.status) === "Occupied").length;
      const totalBeds = beds.length;
      const criticalPatients = patients.filter(p => (p.status_c || p.status) === "Critical").length;
      const availableBeds = beds.filter(bed => (bed.status_c || bed.status) === "Available").length;

      setStats({
        totalPatients: patients.length,
        bedOccupancy: `${occupiedBeds}/${totalBeds}`,
        bedOccupancyPercent: Math.round((occupiedBeds / totalBeds) * 100),
        todaysAppointments: appointments.length,
        criticalPatients: criticalPatients,
        availableBeds: availableBeds
      });

      setRecentPatients(patients.slice(0, 5));
      setTodaysAppointments(appointments.slice(0, 5));

    } catch (err) {
      setError("Failed to load dashboard data");
      toast.error("Failed to load dashboard data");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadDashboardData();
  }, []);

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadDashboardData} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Hospital Dashboard
          </h1>
          <p className="text-gray-600 mt-2">
            Welcome back! Here's your hospital overview for today.
          </p>
        </div>
        <Button onClick={loadDashboardData}>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard
          title="Total Patients"
          value={stats.totalPatients}
          icon="Users"
          color="primary"
        />
        <StatsCard
          title="Bed Occupancy"
          value={`${stats.bedOccupancyPercent}%`}
          icon="Bed"
          color="secondary"
          trend="up"
          trendValue={stats.bedOccupancy}
        />
        <StatsCard
          title="Today's Appointments"
          value={stats.todaysAppointments}
          icon="Calendar"
          color="accent"
        />
        <StatsCard
          title="Critical Patients"
          value={stats.criticalPatients}
          icon="AlertTriangle"
          color="error"
        />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Recent Patients */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Users" size={20} className="text-primary" />
              <span>Recent Patients</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPatients.map((patient) => (
                <motion.div
                  key={patient.Id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div className="flex items-center space-x-3">
<div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                      <ApperIcon name="User" size={18} className="text-white" />
                    </div>
                    <div>
                      <p className="font-medium text-gray-900">{patient.name_c || patient.name}</p>
                      <p className="text-sm text-gray-500">{patient.id_c || patient.id}</p>
                    </div>
                  </div>
                  <Badge variant={(patient.status_c || patient.status || '').toLowerCase()}>
                    {patient.status_c || patient.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Today's Appointments */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={20} className="text-accent" />
              <span>Today's Appointments</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {todaysAppointments.map((appointment) => (
                <motion.div
                  key={appointment.Id}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
className="flex items-center justify-between p-3 bg-gradient-to-r from-blue-50 to-cyan-50 rounded-lg hover:shadow-md transition-all duration-200"
                >
                  <div>
                    <p className="font-medium text-gray-900">{appointment.type_c || appointment.type}</p>
                    <p className="text-sm text-gray-600">{appointment.department_c || appointment.department}</p>
                    <p className="text-xs text-gray-500">
                      {new Date(appointment.date_time_c || appointment.dateTime).toLocaleTimeString('en-US', {
                        hour: '2-digit',
                        minute: '2-digit'
                      })}
                    </p>
                  </div>
                  <Badge variant="info">
                    {appointment.status_c || appointment.status}
                  </Badge>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Zap" size={20} className="text-warning" />
            <span>Quick Actions</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <ApperIcon name="UserPlus" size={20} />
              <span className="text-sm">Add Patient</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <ApperIcon name="CalendarPlus" size={20} />
              <span className="text-sm">Schedule</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <ApperIcon name="Bed" size={20} />
              <span className="text-sm">Manage Beds</span>
            </Button>
            <Button variant="outline" className="h-16 flex-col space-y-1">
              <ApperIcon name="AlertTriangle" size={20} />
              <span className="text-sm">Emergency</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Department Status */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Building2" size={20} className="text-success" />
            <span>Department Status</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {[
              { name: "Emergency", status: "Active", beds: "2/4", color: "error" },
              { name: "ICU", status: "Full", beds: "1/2", color: "warning" },
              { name: "General", status: "Available", beds: "1/3", color: "success" }
            ].map((dept) => (
              <div key={dept.name} className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg">
                <div>
                  <p className="font-medium text-gray-900">{dept.name}</p>
                  <p className="text-sm text-gray-600">Beds: {dept.beds}</p>
                </div>
                <Badge variant={dept.color}>
                  {dept.status}
                </Badge>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default DashboardPage;