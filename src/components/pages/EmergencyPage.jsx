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
import patientService from "@/services/api/patientService";
import bedService from "@/services/api/bedService";
import { toast } from "react-toastify";

const EmergencyPage = () => {
  const [emergencyPatients, setEmergencyPatients] = useState([]);
  const [emergencyBeds, setEmergencyBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [showAdmissionForm, setShowAdmissionForm] = useState(false);
  const [triageQueue, setTriageQueue] = useState([]);
  const [newEmergencyPatient, setNewEmergencyPatient] = useState({
    name: "",
    dateOfBirth: "",
    gender: "",
    contact: "",
    emergencyContact: "",
    bloodType: "",
    allergies: [],
    chiefComplaint: "",
    triagePriority: "Low",
    vitalSigns: {
      bloodPressure: "",
      heartRate: "",
      temperature: "",
      respiratoryRate: "",
      oxygenSaturation: ""
    },
    currentWard: "Emergency",
    status: "Critical"
  });

  const triagePriorities = [
    { level: "Critical", color: "error", description: "Immediate attention required" },
    { level: "High", color: "warning", description: "Urgent, within 15 minutes" },
    { level: "Medium", color: "info", description: "Semi-urgent, within 60 minutes" },
    { level: "Low", color: "success", description: "Non-urgent, within 120 minutes" }
  ];

  const loadEmergencyData = async () => {
    try {
      setLoading(true);
      setError("");
      
      const [allPatients, allBeds] = await Promise.all([
        patientService.getAll(),
        bedService.getAll()
      ]);

      const emergencyPts = allPatients.filter(p => p.currentWard === "Emergency" || p.status === "Critical");
      const emergencyBds = allBeds.filter(b => b.ward === "Emergency");
      
      setEmergencyPatients(emergencyPts);
      setEmergencyBeds(emergencyBds);
      
      // Simulate triage queue
      const queue = emergencyPts.map((patient, index) => ({
        ...patient,
        arrivalTime: new Date(Date.now() - (index * 30 * 60 * 1000)).toISOString(),
        triagePriority: ["Critical", "High", "Medium", "Low"][Math.floor(Math.random() * 4)],
        waitTime: Math.floor(Math.random() * 120) + 15
      })).sort((a, b) => {
        const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.triagePriority] - priorityOrder[b.triagePriority];
      });
      
      setTriageQueue(queue);

    } catch (err) {
      setError("Failed to load emergency data");
      toast.error("Failed to load emergency data");
    } finally {
      setLoading(false);
    }
  };

  const handleEmergencyAdmission = async (e) => {
    e.preventDefault();
    try {
      // Find an available emergency bed
      const availableBed = emergencyBeds.find(bed => bed.status === "Available");
      
      const patientData = {
        ...newEmergencyPatient,
        bedNumber: availableBed ? availableBed.number : "E01"
      };

      await patientService.create(patientData);
      
      // If bed is available, assign patient to it
      if (availableBed) {
        await bedService.assignPatient(availableBed.Id, `P${String(Date.now()).slice(-3)}`);
      }

      toast.success("Emergency patient admitted successfully");
      setShowAdmissionForm(false);
      setNewEmergencyPatient({
        name: "",
        dateOfBirth: "",
        gender: "",
        contact: "",
        emergencyContact: "",
        bloodType: "",
        allergies: [],
        chiefComplaint: "",
        triagePriority: "Low",
        vitalSigns: {
          bloodPressure: "",
          heartRate: "",
          temperature: "",
          respiratoryRate: "",
          oxygenSaturation: ""
        },
        currentWard: "Emergency",
        status: "Critical"
      });
      loadEmergencyData();
    } catch (err) {
      toast.error("Failed to admit emergency patient");
    }
  };

  const handleTriageUpdate = (patientId, newPriority) => {
    setTriageQueue(queue => 
      queue.map(patient => 
        patient.Id === patientId 
          ? { ...patient, triagePriority: newPriority }
          : patient
      ).sort((a, b) => {
        const priorityOrder = { "Critical": 0, "High": 1, "Medium": 2, "Low": 3 };
        return priorityOrder[a.triagePriority] - priorityOrder[b.triagePriority];
      })
    );
    toast.success("Triage priority updated");
  };

  useEffect(() => {
    loadEmergencyData();
  }, []);

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadEmergencyData} />;

  const availableEmergencyBeds = emergencyBeds.filter(bed => bed.status === "Available").length;
  const occupiedEmergencyBeds = emergencyBeds.filter(bed => bed.status === "Occupied").length;
  const criticalPatients = triageQueue.filter(p => p.triagePriority === "Critical").length;
  const averageWaitTime = triageQueue.length > 0 ? Math.round(triageQueue.reduce((sum, p) => sum + p.waitTime, 0) / triageQueue.length) : 0;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-error to-red-600 bg-clip-text text-transparent">
            Emergency Department
          </h1>
          <p className="text-gray-600 mt-2">
            Fast-track emergency admissions and triage management
          </p>
        </div>
        <Button variant="danger" onClick={() => setShowAdmissionForm(true)}>
          <ApperIcon name="Zap" size={16} className="mr-2" />
          Emergency Admission
        </Button>
      </motion.div>

      {/* Emergency Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }}>
          <Card className="border-l-4 border-l-error">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Critical Patients</p>
                  <p className="text-3xl font-bold text-error">{criticalPatients}</p>
                </div>
                <ApperIcon name="AlertTriangle" size={32} className="text-error" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
          <Card className="border-l-4 border-l-warning">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Avg Wait Time</p>
                  <p className="text-3xl font-bold text-warning">{averageWaitTime}m</p>
                </div>
                <ApperIcon name="Clock" size={32} className="text-warning" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
          <Card className="border-l-4 border-l-success">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Available Beds</p>
                  <p className="text-3xl font-bold text-success">{availableEmergencyBeds}</p>
                </div>
                <ApperIcon name="Bed" size={32} className="text-success" />
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
          <Card className="border-l-4 border-l-primary">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Queue</p>
                  <p className="text-3xl font-bold text-primary">{triageQueue.length}</p>
                </div>
                <ApperIcon name="Users" size={32} className="text-primary" />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Triage Queue */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="ListChecks" size={20} className="text-primary" />
              <span>Triage Queue</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            {triageQueue.length === 0 ? (
              <Empty
                title="No patients in queue"
                description="The emergency triage queue is empty"
                icon="UserCheck"
              />
            ) : (
              <div className="space-y-3 max-h-96 overflow-y-auto">
                {triageQueue.map((patient, index) => (
                  <motion.div
                    key={patient.Id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between p-4 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                  >
                    <div className="flex items-center space-x-3">
                      <div className="text-sm font-bold text-gray-500">
                        #{index + 1}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900">{patient.name}</p>
                        <p className="text-sm text-gray-600">ID: {patient.id}</p>
                        <p className="text-xs text-gray-500">
                          Wait: {patient.waitTime}min | Arrival: {new Date(patient.arrivalTime).toLocaleTimeString()}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center space-x-2">
                      <select
                        value={patient.triagePriority}
                        onChange={(e) => handleTriageUpdate(patient.Id, e.target.value)}
                        className="text-xs rounded px-2 py-1 border border-gray-300 focus:outline-none focus:ring-1 focus:ring-primary"
                      >
                        {triagePriorities.map(priority => (
                          <option key={priority.level} value={priority.level}>
                            {priority.level}
                          </option>
                        ))}
                      </select>
                      <Badge variant={triagePriorities.find(p => p.level === patient.triagePriority)?.color}>
                        {patient.triagePriority}
                      </Badge>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {/* Emergency Beds Status */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center space-x-2">
              <ApperIcon name="Bed" size={20} className="text-accent" />
              <span>Emergency Beds</span>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-4">
              {emergencyBeds.map((bed) => (
                <motion.div
                  key={bed.Id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className={`p-4 rounded-lg border-2 transition-all duration-200 ${
                    bed.status === "Available"
                      ? "border-success bg-green-50"
                      : bed.status === "Occupied"
                      ? "border-error bg-red-50"
                      : "border-warning bg-yellow-50"
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-semibold">Bed {bed.number}</span>
                    <Badge variant={bed.status === "Available" ? "success" : bed.status === "Occupied" ? "error" : "warning"}>
                      {bed.status}
                    </Badge>
                  </div>
                  {bed.patientId && (
                    <p className="text-sm text-gray-600">
                      Patient: {emergencyPatients.find(p => p.id === bed.patientId)?.name || "Unknown"}
                    </p>
                  )}
                  <p className="text-xs text-gray-500">
                    Last cleaned: {new Date(bed.lastCleaned).toLocaleDateString()}
                  </p>
                </motion.div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Triage Priority Reference */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center space-x-2">
            <ApperIcon name="Info" size={20} className="text-info" />
            <span>Triage Priority Levels</span>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
            {triagePriorities.map((priority) => (
              <div
                key={priority.level}
                className="flex items-center space-x-3 p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg"
              >
                <Badge variant={priority.color} className="text-xs">
                  {priority.level}
                </Badge>
                <div>
                  <p className="text-sm font-medium text-gray-900">{priority.level}</p>
                  <p className="text-xs text-gray-600">{priority.description}</p>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Emergency Admission Form Modal */}
      {showAdmissionForm && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50 overflow-y-auto"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-4xl max-h-[90vh] overflow-y-auto my-4"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold text-error">Emergency Patient Admission</h2>
              <Button variant="ghost" onClick={() => setShowAdmissionForm(false)}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleEmergencyAdmission} className="space-y-6">
              {/* Patient Information */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Patient Information</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <FormField
                    label="Full Name"
                    required
                    value={newEmergencyPatient.name}
                    onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, name: e.target.value})}
                  />
                  <FormField
                    label="Date of Birth"
                    type="date"
                    required
                    value={newEmergencyPatient.dateOfBirth}
                    onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, dateOfBirth: e.target.value})}
                  />
                  <div className="space-y-2">
                    <Label>Gender *</Label>
                    <select
                      required
                      value={newEmergencyPatient.gender}
                      onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, gender: e.target.value})}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Gender</option>
                      <option value="Male">Male</option>
                      <option value="Female">Female</option>
                      <option value="Other">Other</option>
                    </select>
                  </div>
                  <FormField
                    label="Contact Number"
                    required
                    value={newEmergencyPatient.contact}
                    onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, contact: e.target.value})}
                  />
                  <FormField
                    label="Emergency Contact"
                    required
                    value={newEmergencyPatient.emergencyContact}
                    onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, emergencyContact: e.target.value})}
                  />
                  <div className="space-y-2">
                    <Label>Blood Type</Label>
                    <select
                      value={newEmergencyPatient.bloodType}
                      onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, bloodType: e.target.value})}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      <option value="">Select Blood Type</option>
                      <option value="A+">A+</option>
                      <option value="A-">A-</option>
                      <option value="B+">B+</option>
                      <option value="B-">B-</option>
                      <option value="AB+">AB+</option>
                      <option value="AB-">AB-</option>
                      <option value="O+">O+</option>
                      <option value="O-">O-</option>
                    </select>
                  </div>
                </div>
              </div>

              {/* Emergency Details */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Emergency Details</h3>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="col-span-2 space-y-2">
                    <Label>Chief Complaint *</Label>
                    <textarea
                      required
                      value={newEmergencyPatient.chiefComplaint}
                      onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, chiefComplaint: e.target.value})}
                      className="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                      rows="3"
                      placeholder="Primary reason for emergency visit..."
                    />
                  </div>
                  <div className="space-y-2">
                    <Label>Triage Priority *</Label>
                    <select
                      required
                      value={newEmergencyPatient.triagePriority}
                      onChange={(e) => setNewEmergencyPatient({...newEmergencyPatient, triagePriority: e.target.value})}
                      className="w-full h-10 rounded-lg border border-gray-300 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-primary focus:border-transparent"
                    >
                      {triagePriorities.map(priority => (
                        <option key={priority.level} value={priority.level}>
                          {priority.level} - {priority.description}
                        </option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Vital Signs */}
              <div>
                <h3 className="text-lg font-medium text-gray-900 mb-4">Vital Signs</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <FormField
                    label="Blood Pressure"
                    placeholder="120/80"
                    value={newEmergencyPatient.vitalSigns.bloodPressure}
                    onChange={(e) => setNewEmergencyPatient({
                      ...newEmergencyPatient,
                      vitalSigns: {...newEmergencyPatient.vitalSigns, bloodPressure: e.target.value}
                    })}
                  />
                  <FormField
                    label="Heart Rate (bpm)"
                    type="number"
                    placeholder="75"
                    value={newEmergencyPatient.vitalSigns.heartRate}
                    onChange={(e) => setNewEmergencyPatient({
                      ...newEmergencyPatient,
                      vitalSigns: {...newEmergencyPatient.vitalSigns, heartRate: e.target.value}
                    })}
                  />
                  <FormField
                    label="Temperature (°F)"
                    type="number"
                    step="0.1"
                    placeholder="98.6"
                    value={newEmergencyPatient.vitalSigns.temperature}
                    onChange={(e) => setNewEmergencyPatient({
                      ...newEmergencyPatient,
                      vitalSigns: {...newEmergencyPatient.vitalSigns, temperature: e.target.value}
                    })}
                  />
                  <FormField
                    label="Respiratory Rate"
                    type="number"
                    placeholder="16"
                    value={newEmergencyPatient.vitalSigns.respiratoryRate}
                    onChange={(e) => setNewEmergencyPatient({
                      ...newEmergencyPatient,
                      vitalSigns: {...newEmergencyPatient.vitalSigns, respiratoryRate: e.target.value}
                    })}
                  />
                  <FormField
                    label="Oxygen Saturation (%)"
                    type="number"
                    placeholder="98"
                    value={newEmergencyPatient.vitalSigns.oxygenSaturation}
                    onChange={(e) => setNewEmergencyPatient({
                      ...newEmergencyPatient,
                      vitalSigns: {...newEmergencyPatient.vitalSigns, oxygenSaturation: e.target.value}
                    })}
                  />
                </div>
              </div>

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAdmissionForm(false)}>
                  Cancel
                </Button>
                <Button type="submit" variant="danger">
                  <ApperIcon name="Zap" size={16} className="mr-2" />
                  Admit Emergency Patient
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default EmergencyPage;