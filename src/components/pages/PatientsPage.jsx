import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { useOutletContext } from "react-router-dom";
import PatientCard from "@/components/molecules/PatientCard";
import Button from "@/components/atoms/Button";
import SearchBar from "@/components/molecules/SearchBar";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import Badge from "@/components/atoms/Badge";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import FormField from "@/components/molecules/FormField";
import Input from "@/components/atoms/Input";
import Label from "@/components/atoms/Label";
import patientService from "@/services/api/patientService";
import { toast } from "react-toastify";

const PatientsPage = () => {
  const { searchQuery } = useOutletContext();
  const [patients, setPatients] = useState([]);
  const [filteredPatients, setFilteredPatients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedStatus, setSelectedStatus] = useState("All");
  const [showAddForm, setShowAddForm] = useState(false);
const [newPatient, setNewPatient] = useState({
    name_c: "",
    date_of_birth_c: "",
    gender_c: "",
    contact_c: "",
    emergency_contact_c: "",
    blood_type_c: "",
    allergies_c: "",
    current_ward_c: "",
    bed_number_c: "",
    status_c: "Stable"
  });

  const loadPatients = async () => {
    try {
      setLoading(true);
      setError("");
      const data = await patientService.getAll();
      setPatients(data);
      setFilteredPatients(data);
    } catch (err) {
      setError("Failed to load patients");
      toast.error("Failed to load patients");
    } finally {
      setLoading(false);
    }
  };

  const handleAddPatient = async (e) => {
    e.preventDefault();
    try {
      await patientService.create(newPatient);
      toast.success("Patient added successfully");
      setShowAddForm(false);
      setNewPatient({
        name: "",
        dateOfBirth: "",
        gender: "",
        contact: "",
        emergencyContact: "",
        bloodType: "",
        allergies: [],
        currentWard: "",
        bedNumber: "",
        status: "Stable"
      });
      loadPatients();
    } catch (err) {
      toast.error("Failed to add patient");
    }
  };

  const handleViewPatient = (patient) => {
    toast.info(`Viewing patient: ${patient.name}`);
  };

  const handleEditPatient = (patient) => {
    toast.info(`Editing patient: ${patient.name}`);
  };

  const filterPatients = (statusFilter, searchTerm) => {
    let filtered = patients;
    
    if (statusFilter !== "All") {
filtered = filtered.filter(p => (p.status_c || p.status) === statusFilter);
    }
    
    if (searchTerm) {
      const term = searchTerm.toLowerCase();
      filtered = filtered.filter(p =>
        (p.name_c || p.name || '').toLowerCase().includes(term) ||
        (p.id_c || p.id || '').toLowerCase().includes(term) ||
        (p.contact_c || p.contact || '').includes(term)
      );
    }
    
    setFilteredPatients(filtered);
  };

  useEffect(() => {
    loadPatients();
  }, []);

  useEffect(() => {
    filterPatients(selectedStatus, searchQuery);
  }, [patients, selectedStatus, searchQuery]);

  const statusCounts = {
    All: patients.length,
Critical: patients.filter(p => (p.status_c || p.status) === "Critical").length,
    Stable: patients.filter(p => (p.status_c || p.status) === "Stable").length,
    Discharged: patients.filter(p => (p.status_c || p.status) === "Discharged").length
  };

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadPatients} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Patient Management
          </h1>
          <p className="text-gray-600 mt-2">
            Manage patient records and information
          </p>
        </div>
        <Button onClick={() => setShowAddForm(true)}>
          <ApperIcon name="UserPlus" size={16} className="mr-2" />
          Add Patient
        </Button>
      </motion.div>

      {/* Status Filter Pills */}
      <div className="flex flex-wrap gap-2">
        {Object.entries(statusCounts).map(([status, count]) => (
          <button
            key={status}
            onClick={() => setSelectedStatus(status)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedStatus === status
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {status} ({count})
          </button>
        ))}
      </div>

      {/* Search Bar */}
      <SearchBar
        placeholder="Search patients by name, ID, or phone..."
        onSearch={(query) => filterPatients(selectedStatus, query)}
        className="max-w-md"
      />

      {/* Add Patient Form Modal */}
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
              <h2 className="text-xl font-semibold">Add New Patient</h2>
              <Button variant="ghost" onClick={() => setShowAddForm(false)}>
                <ApperIcon name="X" size={20} />
              </Button>
            </div>

            <form onSubmit={handleAddPatient} className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
<FormField
                  label="Full Name"
                  required
                  value={newPatient.name_c}
                  onChange={(e) => setNewPatient({...newPatient, name_c: e.target.value})}
                />
                <FormField
                  label="Date of Birth"
                  type="date"
                  required
                  value={newPatient.date_of_birth_c}
                  onChange={(e) => setNewPatient({...newPatient, date_of_birth_c: e.target.value})}
                />
                <div className="space-y-2">
                  <Label>Gender *</Label>
                  <select
                    required
                    value={newPatient.gender_c}
                    onChange={(e) => setNewPatient({...newPatient, gender_c: e.target.value})}
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
                  value={newPatient.contact_c}
                  onChange={(e) => setNewPatient({...newPatient, contact_c: e.target.value})}
                />
                <FormField
                  label="Emergency Contact"
                  required
                  value={newPatient.emergency_contact_c}
                  onChange={(e) => setNewPatient({...newPatient, emergency_contact_c: e.target.value})}
                />
                <div className="space-y-2">
                  <Label>Blood Type</Label>
                  <select
                    value={newPatient.blood_type_c}
                    onChange={(e) => setNewPatient({...newPatient, blood_type_c: e.target.value})}
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

              <div className="flex justify-end space-x-3 pt-4">
                <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                  Cancel
                </Button>
                <Button type="submit">
                  Add Patient
                </Button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}

      {/* Patients Grid */}
      {filteredPatients.length === 0 ? (
        <Empty
          title="No patients found"
          description="No patients match your current filters"
          icon="Users"
        />
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredPatients.map((patient) => (
            <PatientCard
              key={patient.Id}
              patient={patient}
              onView={handleViewPatient}
              onEdit={handleEditPatient}
            />
          ))}
        </div>
      )}
    </div>
  );
};

export default PatientsPage;