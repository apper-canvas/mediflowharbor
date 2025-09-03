import { toast } from "react-toastify";

class AppointmentService {
  constructor() {
    this.tableName = 'appointment_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
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
      console.error("Error fetching appointments:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
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
      console.error(`Error fetching appointment record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(appointmentData) {
    try {
      const params = {
        records: [{
          Name: appointmentData.name_c || appointmentData.name || '',
          id_c: appointmentData.id_c || '',
          patient_id_c: appointmentData.patient_id_c || appointmentData.patientId || '',
          doctor_id_c: appointmentData.doctor_id_c || appointmentData.doctorId || '',
          department_c: appointmentData.department_c || appointmentData.department || '',
          date_time_c: appointmentData.date_time_c || appointmentData.dateTime || '',
          duration_c: appointmentData.duration_c || appointmentData.duration || 30,
          type_c: appointmentData.type_c || appointmentData.type || '',
          status_c: appointmentData.status_c || appointmentData.status || 'Scheduled',
          notes_c: appointmentData.notes_c || appointmentData.notes || ''
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
          console.error(`Failed to create ${failed.length} appointment records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating appointment record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, appointmentData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: appointmentData.name_c || appointmentData.name || '',
          id_c: appointmentData.id_c || '',
          patient_id_c: appointmentData.patient_id_c || appointmentData.patientId || '',
          doctor_id_c: appointmentData.doctor_id_c || appointmentData.doctorId || '',
          department_c: appointmentData.department_c || appointmentData.department || '',
          date_time_c: appointmentData.date_time_c || appointmentData.dateTime || '',
          duration_c: appointmentData.duration_c || appointmentData.duration || 30,
          type_c: appointmentData.type_c || appointmentData.type || '',
          status_c: appointmentData.status_c || appointmentData.status || '',
          notes_c: appointmentData.notes_c || appointmentData.notes || ''
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
          console.error(`Failed to update ${failed.length} appointment records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating appointment record:", error?.response?.data?.message || error);
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
      console.error("Error deleting appointment record:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByDateRange(startDate, endDate) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        whereGroups: [{
          "operator": "AND",
          "subGroups": [
            {"conditions": [{"fieldName": "date_time_c", "operator": "GreaterThanOrEqualTo", "values": [startDate]}], "operator": ""},
            {"conditions": [{"fieldName": "date_time_c", "operator": "LessThanOrEqualTo", "values": [endDate]}], "operator": ""}
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
      console.error("Error fetching appointments by date range:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "department_c", "Operator": "EqualTo", "Values": [department]}]
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
      console.error("Error fetching appointments by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getTodaysAppointments() {
    try {
      const today = new Date().toISOString().split('T')[0];
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "doctor_id_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "date_time_c"}},
          {"field": {"Name": "duration_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "notes_c"}}
        ],
        where: [{"FieldName": "date_time_c", "Operator": "StartsWith", "Values": [today]}]
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
      console.error("Error fetching today's appointments:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new AppointmentService();
export default new AppointmentService();