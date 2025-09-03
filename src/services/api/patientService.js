import { toast } from "react-toastify";

class PatientService {
  constructor() {
    this.tableName = 'patient_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.getRecordById(this.tableName, id, params);

      if (!response?.data) {
        return null;
      }
      return response.data;
    } catch (error) {
      console.error(`Error fetching patient record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(patientData) {
    try {
      const params = {
        records: [{
          Name: patientData.name_c || patientData.name || '',
          id_c: patientData.id_c || '',
          name_c: patientData.name_c || patientData.name || '',
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth || '',
          gender_c: patientData.gender_c || patientData.gender || '',
          contact_c: patientData.contact_c || patientData.contact || '',
          emergency_contact_c: patientData.emergency_contact_c || patientData.emergencyContact || '',
          blood_type_c: patientData.blood_type_c || patientData.bloodType || '',
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : (patientData.allergies_c || patientData.allergies || ''),
          current_ward_c: patientData.current_ward_c || patientData.currentWard || '',
          bed_number_c: patientData.bed_number_c || patientData.bedNumber || '',
          status_c: patientData.status_c || patientData.status || 'Stable',
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || new Date().toISOString().split('T')[0]
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.createRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to create ${failed.length} patient records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating patient record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, patientData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: patientData.name_c || patientData.name || '',
          id_c: patientData.id_c || '',
          name_c: patientData.name_c || patientData.name || '',
          date_of_birth_c: patientData.date_of_birth_c || patientData.dateOfBirth || '',
          gender_c: patientData.gender_c || patientData.gender || '',
          contact_c: patientData.contact_c || patientData.contact || '',
          emergency_contact_c: patientData.emergency_contact_c || patientData.emergencyContact || '',
          blood_type_c: patientData.blood_type_c || patientData.bloodType || '',
          allergies_c: Array.isArray(patientData.allergies) ? patientData.allergies.join(', ') : (patientData.allergies_c || patientData.allergies || ''),
          current_ward_c: patientData.current_ward_c || patientData.currentWard || '',
          bed_number_c: patientData.bed_number_c || patientData.bedNumber || '',
          status_c: patientData.status_c || patientData.status || '',
          admission_date_c: patientData.admission_date_c || patientData.admissionDate || ''
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.updateRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return null;
      }

      if (response.results) {
        const successful = response.results.filter(r => r.success);
        const failed = response.results.filter(r => !r.success);

        if (failed.length > 0) {
          console.error(`Failed to update ${failed.length} patient records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating patient record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async delete(id) {
    try {
      const params = { 
        RecordIds: [parseInt(id)]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.deleteRecord(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        toast.error(response.message);
        return false;
      }

      return true;
    } catch (error) {
      console.error("Error deleting patient record:", error?.response?.data?.message || error);
      return false;
    }
  }

  async search(query) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        whereGroups: [{
          "operator": "OR",
          "subGroups": [
            {"conditions": [{"fieldName": "name_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "id_c", "operator": "Contains", "values": [query]}], "operator": ""},
            {"conditions": [{"fieldName": "contact_c", "operator": "Contains", "values": [query]}], "operator": ""}
          ]
        }]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error searching patients:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByStatus(status) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "date_of_birth_c"}},
          {"field": {"Name": "gender_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "emergency_contact_c"}},
          {"field": {"Name": "blood_type_c"}},
          {"field": {"Name": "allergies_c"}},
          {"field": {"Name": "current_ward_c"}},
          {"field": {"Name": "bed_number_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "admission_date_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": [status]}]
      };

      const { ApperClient } = window.ApperSDK;
      const apperClient = new ApperClient({
        apperProjectId: import.meta.env.VITE_APPER_PROJECT_ID,
        apperPublicKey: import.meta.env.VITE_APPER_PUBLIC_KEY
      });

      const response = await apperClient.fetchRecords(this.tableName, params);

      if (!response.success) {
        console.error(response.message);
        return [];
      }

      return response.data || [];
    } catch (error) {
      console.error("Error fetching patients by status:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new PatientService();