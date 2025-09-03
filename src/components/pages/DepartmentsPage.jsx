import { useState, useEffect } from "react";
import { motion } from "framer-motion";
import { Card, CardHeader, CardTitle, CardContent } from "@/components/atoms/Card";
import Button from "@/components/atoms/Button";
import Badge from "@/components/atoms/Badge";
import Loading from "@/components/ui/Loading";
import Error from "@/components/ui/Error";
import Empty from "@/components/ui/Empty";
import ApperIcon from "@/components/ApperIcon";
import staffService from "@/services/api/staffService";
import bedService from "@/services/api/bedService";
import { toast } from "react-toastify";

const DepartmentsPage = () => {
  const [staff, setStaff] = useState([]);
  const [beds, setBeds] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [selectedDepartment, setSelectedDepartment] = useState("All");

  const departments = ["All", "Cardiology", "General Medicine", "Orthopedics", "Obstetrics", "Emergency", "ICU", "Administration"];

  const loadData = async () => {
    try {
      setLoading(true);
      setError("");
      const [staffData, bedsData] = await Promise.all([
        staffService.getAll(),
        bedService.getAll()
      ]);
      setStaff(staffData);
      setBeds(bedsData);
    } catch (err) {
      setError("Failed to load department information");
      toast.error("Failed to load department information");
    } finally {
      setLoading(false);
    }
  };

  const getDepartmentStats = (deptName) => {
const deptStaff = staff.filter(s => (s.department_c || s.department) === deptName);
    const deptBeds = beds.filter(b => (b.ward_c || b.ward) === deptName || (deptName === "General Medicine" && (b.ward_c || b.ward) === "General"));
    
    const doctors = deptStaff.filter(s => (s.role_c || s.role) === "Doctor").length;
    const nurses = deptStaff.filter(s => (s.role_c || s.role) === "Nurse").length;
    const onDuty = deptStaff.filter(s => (s.shift_c || s.shift) === "Day").length;
    
    const totalBeds = deptBeds.length;
    const occupiedBeds = deptBeds.filter(b => (b.status_c || b.status) === "Occupied").length;
    const availableBeds = deptBeds.filter(b => (b.status_c || b.status) === "Available").length;

    return {
      name: deptName,
      totalStaff: deptStaff.length,
      doctors,
      nurses,
      onDuty,
      totalBeds,
      occupiedBeds,
      availableBeds,
      occupancyRate: totalBeds > 0 ? Math.round((occupiedBeds / totalBeds) * 100) : 0,
      staff: deptStaff
    };
  };

  const departmentList = departments.slice(1).map(dept => getDepartmentStats(dept));

  const filteredDepartments = selectedDepartment === "All" 
    ? departmentList 
    : departmentList.filter(dept => dept.name === selectedDepartment);

  const getDepartmentIcon = (department) => {
    const icons = {
      "Cardiology": "Heart",
      "General Medicine": "Stethoscope",
      "Orthopedics": "Bone",
      "Obstetrics": "Baby",
      "Emergency": "Zap",
      "ICU": "Activity",
      "Administration": "Building2"
    };
    return icons[department] || "Building";
  };

  const getRoleIcon = (role) => {
    const icons = {
      "Doctor": "UserCheck",
      "Nurse": "Heart",
      "Surgeon": "Scissors",
      "Administrator": "Settings"
    };
    return icons[role] || "User";
  };

  useEffect(() => {
    loadData();
  }, []);

  if (loading) return <Loading variant="grid" />;
  if (error) return <Error message={error} onRetry={loadData} />;

  return (
    <div className="space-y-6">
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4"
      >
        <div>
          <h1 className="text-3xl font-bold bg-gradient-to-r from-primary to-secondary bg-clip-text text-transparent">
            Department Management
          </h1>
          <p className="text-gray-600 mt-2">
            Overview of hospital departments, staff, and resources
          </p>
        </div>
        <Button onClick={loadData}>
          <ApperIcon name="RefreshCw" size={16} className="mr-2" />
          Refresh
        </Button>
      </motion.div>

      {/* Department Filter */}
      <div className="flex flex-wrap gap-2">
        {departments.map(dept => (
          <button
            key={dept}
            onClick={() => setSelectedDepartment(dept)}
            className={`px-4 py-2 rounded-full text-sm font-medium transition-all duration-200 ${
              selectedDepartment === dept
                ? "bg-gradient-to-r from-primary to-secondary text-white shadow-lg"
                : "bg-gray-100 text-gray-600 hover:bg-gray-200"
            }`}
          >
            {dept}
          </button>
        ))}
      </div>

      {/* Department Overview Cards */}
      {filteredDepartments.length === 0 ? (
        <Empty
          title="No departments found"
          description="No departments match your current selection"
          icon="Building2"
        />
      ) : (
        <div className="space-y-6">
          {filteredDepartments.map((department) => (
            <motion.div
              key={department.name}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <Card className="hover:shadow-xl transition-all duration-300">
                <CardHeader>
                  <CardTitle className="flex items-center space-x-3">
                    <div className="w-10 h-10 bg-gradient-to-r from-primary to-secondary rounded-lg flex items-center justify-center">
                      <ApperIcon name={getDepartmentIcon(department.name)} size={20} className="text-white" />
                    </div>
                    <div>
                      <span className="text-xl">{department.name}</span>
                      <div className="flex items-center space-x-4 mt-2">
                        <Badge variant="info">
                          {department.onDuty} On Duty
                        </Badge>
                        {department.totalBeds > 0 && (
                          <Badge variant={department.occupancyRate > 80 ? "warning" : "success"}>
                            {department.occupancyRate}% Occupancy
                          </Badge>
                        )}
                      </div>
                    </div>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {/* Staff Overview */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <ApperIcon name="Users" size={16} className="text-primary" />
                        <span>Staff Overview</span>
                      </h4>
                      <div className="space-y-3">
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-blue-50 to-indigo-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Total Staff</span>
                          <span className="text-lg font-bold text-primary">{department.totalStaff}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Doctors</span>
                          <span className="text-lg font-bold text-success">{department.doctors}</span>
                        </div>
                        <div className="flex justify-between items-center p-3 bg-gradient-to-r from-purple-50 to-violet-50 rounded-lg">
                          <span className="text-sm font-medium text-gray-600">Nurses</span>
                          <span className="text-lg font-bold text-purple-600">{department.nurses}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bed Management (if applicable) */}
                    {department.totalBeds > 0 && (
                      <div className="space-y-4">
                        <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                          <ApperIcon name="Bed" size={16} className="text-accent" />
                          <span>Bed Status</span>
                        </h4>
                        <div className="space-y-3">
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-gray-50 to-slate-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Total Beds</span>
                            <span className="text-lg font-bold text-gray-700">{department.totalBeds}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-red-50 to-rose-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Occupied</span>
                            <span className="text-lg font-bold text-error">{department.occupiedBeds}</span>
                          </div>
                          <div className="flex justify-between items-center p-3 bg-gradient-to-r from-green-50 to-emerald-50 rounded-lg">
                            <span className="text-sm font-medium text-gray-600">Available</span>
                            <span className="text-lg font-bold text-success">{department.availableBeds}</span>
                          </div>
                        </div>
                      </div>
                    )}

                    {/* Staff List */}
                    <div className="space-y-4">
                      <h4 className="font-semibold text-gray-900 flex items-center space-x-2">
                        <ApperIcon name="UserCheck" size={16} className="text-success" />
                        <span>Staff Members</span>
                      </h4>
                      <div className="space-y-2 max-h-60 overflow-y-auto">
                        {department.staff.length === 0 ? (
                          <p className="text-sm text-gray-500 text-center py-4">No staff assigned</p>
                        ) : (
                          department.staff.map((staffMember) => (
                            <div
                              key={staffMember.Id}
                              className="flex items-center justify-between p-3 bg-gradient-to-r from-gray-50 to-gray-100 rounded-lg hover:shadow-md transition-all duration-200"
                            >
                              <div className="flex items-center space-x-3">
<div className="w-8 h-8 bg-gradient-to-r from-primary to-secondary rounded-full flex items-center justify-center">
                                <ApperIcon name={getRoleIcon(staffMember.role_c || staffMember.role)} size={14} className="text-white" />
                              </div>
                              <div>
                                <p className="font-medium text-sm text-gray-900">{staffMember.name_c || staffMember.name}</p>
                                <p className="text-xs text-gray-500">{staffMember.specialization_c || staffMember.specialization}</p>
                              </div>
                            </div>
                            <div className="flex items-center space-x-2">
                              <Badge variant={(staffMember.shift_c || staffMember.shift) === "Day" ? "success" : "warning"} className="text-xs">
                                {staffMember.shift_c || staffMember.shift}
                              </Badge>
                              <Badge variant="outline" className="text-xs">
                                {staffMember.role_c || staffMember.role}
                              </Badge>
                              </div>
                            </div>
                          ))
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Quick Actions */}
                  <div className="mt-6 pt-6 border-t border-gray-200">
                    <div className="flex flex-wrap gap-3">
                      <Button variant="outline" size="sm">
                        <ApperIcon name="UserPlus" size={16} className="mr-2" />
                        Add Staff
                      </Button>
                      <Button variant="outline" size="sm">
                        <ApperIcon name="Calendar" size={16} className="mr-2" />
                        View Schedule
                      </Button>
                      {department.totalBeds > 0 && (
                        <Button variant="outline" size="sm">
                          <ApperIcon name="Bed" size={16} className="mr-2" />
                          Manage Beds
                        </Button>
                      )}
                      <Button variant="outline" size="sm">
                        <ApperIcon name="BarChart3" size={16} className="mr-2" />
                        View Reports
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
};

export default DepartmentsPage;