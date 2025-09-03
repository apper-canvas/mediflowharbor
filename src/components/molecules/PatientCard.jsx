import { motion } from "framer-motion";
import { Card, CardContent } from "@/components/atoms/Card";
import Badge from "@/components/atoms/Badge";
import Button from "@/components/atoms/Button";
import ApperIcon from "@/components/ApperIcon";

const PatientCard = ({ patient, onView, onEdit }) => {
  const status = patient.status_c || patient.status;
  const statusVariant = {
    "Critical": "critical",
    "Stable": "stable", 
    "Discharged": "discharged"
  }[status] || "default";

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      whileHover={{ y: -2 }}
      transition={{ duration: 0.2 }}
    >
      <Card className="hover:shadow-lg transition-all duration-200">
<CardContent className="p-6">
          <div className="flex items-start justify-between mb-4">
            <div>
              <h3 className="font-semibold text-lg text-gray-900">{patient.name_c || patient.name}</h3>
              <p className="text-sm text-gray-500">ID: {patient.id_c || patient.id}</p>
            </div>
            <Badge variant={statusVariant}>
              {status}
            </Badge>
          </div>
          
          <div className="space-y-2 mb-4 text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <ApperIcon name="Calendar" size={16} />
              <span>DOB: {new Date(patient.date_of_birth_c || patient.dateOfBirth).toLocaleDateString()}</span>
            </div>
            <div className="flex items-center space-x-2">
              <ApperIcon name="Phone" size={16} />
              <span>{patient.contact_c || patient.contact}</span>
            </div>
            {(patient.current_ward_c || patient.currentWard) && (
              <div className="flex items-center space-x-2">
                <ApperIcon name="MapPin" size={16} />
                <span>{patient.current_ward_c || patient.currentWard} - Bed {patient.bed_number_c || patient.bedNumber}</span>
              </div>
            )}
          </div>

          <div className="flex space-x-2">
            <Button variant="outline" size="sm" onClick={() => onView(patient)}>
              <ApperIcon name="Eye" size={16} className="mr-1" />
              View
            </Button>
            <Button variant="ghost" size="sm" onClick={() => onEdit(patient)}>
              <ApperIcon name="Edit" size={16} className="mr-1" />
              Edit
            </Button>
          </div>
        </CardContent>
      </Card>
    </motion.div>
  );
};

export default PatientCard;