import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import bedService from "@/services/api/bedService";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";
import { cn } from "@/utils/cn";

const BedsPage = () => {
  const [beds, setBeds] = useState([]);
  const [patients, setPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedWard, setSelectedWard] = useState("All");
  const [selectedBed, setSelectedBed] = useState(null);
  const [showAssignModal, setShowAssignModal] = useState(false);

  const wards = ["All", "ICU", "General", "Emergency", "Cardiology", "Maternity"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [bedsData, patientsData] = await Promise.all([
        bedService.getAll(),
        patientService.getAll()
      ]);
      setBeds(bedsData);
      setPatients(patientsData);
    } catch (err) {
      setError("Failed to load bed information");
      toast.error("Failed to load bed information");
    } finally {
      setLoading(false);
    }
  };

  const handleAssignPatient = async (bedId, patientId) => {
    try {
      await bedService.assignPatient(bedId, patientId);
      toast.success("Patient assigned to bed successfully");
      setShowAssignModal(false);
      setSelectedBed(null);
      loadData();
    } catch (err) {
      toast.error("Failed to assign patient to bed");
    }
  };

  const handleReleasePatient = async (bedId) => {
    try {
      await bedService.releasePatient(bedId);
      toast.success("Patient released from bed");
      loadData();
    } catch (err) {
      toast.error("Failed to release patient from bed");
    }
  };

  const getPatientName = (patientId) => {
    const patient = patients.find(p => p.id === patientId);
    return patient ? patient.name : "Unknown Patient";
  };

  const getAvailablePatients = () => {
    return patients.filter(p => p.status !== "Discharged" && !p.currentWard);
  };

  const filteredBeds = beds.filter(bed => {
    if (selectedWard === "All") return true;
    return bed.ward === selectedWard;
  });

  const wardStats = wards.slice(1).map(ward => {
    const wardBeds = beds.filter(b => b.ward === ward);
    const occupied = wardBeds.filter(b => b.status === "Occupied").length;
    const available = wardBeds.filter(b => b.status === "Available").length;
    const maintenance = wardBeds.filter(b => b.status === "Maintenance").length;
    
    return {
      name: ward,
      total: wardBeds.length,
      occupied,
      available,
      maintenance,
      occupancyRate: wardBeds.length > 0 ? Math.round((occupied / wardBeds.length) * 100) : 0
    };
  });

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  const getBedStatusColor = (status) => {
    switch (status) {
      case "Available": return "success";
      case "Occupied": return "error";
      case "Maintenance": return "warning";
      default: return "default";
    }
  };

  const getBedIcon = (type) => {
    switch (type) {
      case "ICU": return "Heart";
      case "Emergency": return "Zap";
      case "Maternity": return "Baby";
      case "Specialty": return "Stethoscope";
      default: return "Bed";
    }
  };

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Bed Management
          </h1>
          <p className="text-gray-600 mt-2">
            Monitor bed occupancy and manage patient assignments
          </p>
        </div>
        <Button onClick={loadData}>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Ward Statistics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {wardStats.map((ward) => (
          <motion.div
            key={ward.name}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
          >
            <Card className="hover:shadow-lg transition-all duration-200">
              <CardContent className="p-6">
                <div className="flex items-center justify-between mb-4">
                  <h3 className="font-semibold text-lg text-gray-900">{ward.name}</h3>
                  <div className="text-2xl font-bold text-primary">
                    {ward.occupancyRate}%
                  </div>
                </div>
                
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Total Beds</span>
                    <span className="font-medium">{ward.total}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Occupied</span>
                    <span className="font-medium text-error">{ward.occupied}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Available</span>
                    <span className="font-medium text-success">{ward.available}</span>
                  </div>
                  <div className="flex justify-between text-sm">
                    <span className="text-gray-600">Maintenance</span>
                    <span className="font-medium text-warning">{ward.maintenance}</span>
                  </div>
                </div>

                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-gradient-to-r from-primary to-secondary h-2 rounded-full transition-all duration-300"
                    style={{ width: `${ward.occupancyRate}%` }}
                  />
                </div>
              </CardContent>
            </Card>
          </motion.div>
        ))}
      </div>

      {/* Ward Filter */}
      <div className="flex flex-wrap gap-2">
        {wards.map(ward => (
          <button
            key={ward}
            onClick={() => setSelectedWard(ward)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedWard === ward
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {ward}
          </button>
        ))}
      </div>

      {/* Beds Grid */}
      {filteredBeds.length === 0 ? (
        <Empty
          title="No beds found"
          description="No beds available for the selected ward"
          icon="Bed"
        />
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
          {filteredBeds.map((bed) => (
            <motion.div
              key={bed.Id}
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              whileHover={{ scale: 1.02 }}
              transition={{ duration: 0.2 }}
            >
              <Card className={cn(
                "hover:shadow-lg transition-all duration-200 cursor-pointer",
                bed.status === "Available" && "ring-2 ring-success ring-opacity-20",
                bed.status === "Occupied" && "ring-2 ring-error ring-opacity-20",
                bed.status === "Maintenance" && "ring-2 ring-warning ring-opacity-20"
              )}>
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-3">
                    <div className="flex items-center space-x-2">
                      <ApperIcon name={getBedIcon(bed.type)} size={20} className="text-primary" />
                      <span className="font-semibold text-gray-900">{bed.ward} - {bed.number}</span>
                    </div>
                    <Badge variant={getBedStatusColor(bed.status)}>
                      {bed.status}
                    </Badge>
                  </div>

                  <div className="space-y-2 text-sm text-gray-600 mb-4">
                    <p>Type: <span className="font-medium">{bed.type}</span></p>
                    {bed.patientId && (
                      <p>Patient: <span className="font-medium">{getPatientName(bed.patientId)}</span></p>
                    )}
                    <p>Last Cleaned: <span className="font-medium">
                      {new Date(bed.lastCleaned).toLocaleDateString()}
                    </span></p>
                  </div>

                  <div className="flex space-x-2">
                    {bed.status === "Available" && (
                      <Button
                        size="sm"
                        variant="primary"
                        onClick={() => {
                          setSelectedBed(bed);
                          setShowAssignModal(true);
                        }}
                      >
                        <ApperIcon name="UserPlus" size={14} className="mr-1" />
                        Assign
                      </Button>
                    )}
                    {bed.status === "Occupied" && (
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleReleasePatient(bed.Id)}
                      >
                        <ApperIcon name="UserMinus" size={14} className="mr-1" />
                        Release
                      </Button>
                    )}
                    <Button size="sm" variant="ghost">
                      <ApperIcon name="Edit" size={14} />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Assign Patient Modal */}
      {showAssignModal && selectedBed && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50"
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-white rounded-lg p-6 w-full max-w-md"
          >
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-xl font-semibold">
                Assign Patient to Bed {selectedBed.ward} - {selectedBed.number}
              </h2>
              <Button variant="ghost" onClick={() => setShowAssignModal(false)}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <div className="space-y-4">
              <p className="text-sm text-gray-600">Select a patient to assign to this bed:</p>
              
              {getAvailablePatients().length === 0 ? (
                <p className="text-center text-gray-500 py-8">
                  No available patients to assign
                </p>
              ) : (
                <div className="space-y-2 max-h-60 overflow-y-auto">
                  {getAvailablePatients().map((patient) => (
                    <button
                      key={patient.Id}
                      onClick={() => handleAssignPatient(selectedBed.Id, patient.id)}
                      className="w-full p-3 text-left bg-gray-50 hover:bg-gray-100 rounded-lg transition-colors duration-200"
                    >
                      <div className="flex items-center justify-between">
                        <div>
                          <p className="font-medium text-gray-900">{patient.name}</p>
                          <p className="text-sm text-gray-500">ID: {patient.id}</p>
                        </div>
                        <Badge variant={patient.status.toLowerCase()}>
                          {patient.status}
                        </Badge>
                      </div>
                    </button>
                  ))}
                </div>
              )}
            </div>

            <div className="flex justify-end space-x-3 pt-4 mt-6 border-t">
              <Button variant="outline" onClick={() => setShowAssignModal(false)}>
                Cancel
              </Button>
            </div>
          </motion.div>
        </motion.div>
      )}
    </div>
  );
};

export default BedsPage;