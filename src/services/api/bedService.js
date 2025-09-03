import { toast } from "react-toastify";

class BedService {
  constructor() {
    this.tableName = 'bed_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
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
      console.error("Error fetching beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getById(id) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
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
      console.error(`Error fetching bed record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(bedData) {
    try {
      const params = {
        records: [{
          Name: bedData.name_c || bedData.name || '',
          id_c: bedData.id_c || '',
          ward_c: bedData.ward_c || bedData.ward || '',
          number_c: bedData.number_c || bedData.number || '',
          type_c: bedData.type_c || bedData.type || '',
          status_c: bedData.status_c || bedData.status || 'Available',
          patient_id_c: bedData.patient_id_c || bedData.patientId || '',
          last_cleaned_c: bedData.last_cleaned_c || bedData.lastCleaned || new Date().toISOString()
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
          console.error(`Failed to create ${failed.length} bed records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating bed record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, bedData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: bedData.name_c || bedData.name || '',
          id_c: bedData.id_c || '',
          ward_c: bedData.ward_c || bedData.ward || '',
          number_c: bedData.number_c || bedData.number || '',
          type_c: bedData.type_c || bedData.type || '',
          status_c: bedData.status_c || bedData.status || '',
          patient_id_c: bedData.patient_id_c || bedData.patientId || '',
          last_cleaned_c: bedData.last_cleaned_c || bedData.lastCleaned || ''
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
          console.error(`Failed to update ${failed.length} bed records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating bed record:", error?.response?.data?.message || error);
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
      console.error("Error deleting bed record:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByWard(ward) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "ward_c", "Operator": "EqualTo", "Values": [ward]}]
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
      console.error("Error fetching beds by ward:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getAvailableBeds() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": ["Available"]}]
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
      console.error("Error fetching available beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getOccupiedBeds() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "ward_c"}},
          {"field": {"Name": "number_c"}},
          {"field": {"Name": "type_c"}},
          {"field": {"Name": "status_c"}},
          {"field": {"Name": "patient_id_c"}},
          {"field": {"Name": "last_cleaned_c"}}
        ],
        where: [{"FieldName": "status_c", "Operator": "EqualTo", "Values": ["Occupied"]}]
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
      console.error("Error fetching occupied beds:", error?.response?.data?.message || error);
      return [];
    }
  }

  async assignPatient(bedId, patientId) {
    try {
      const params = {
        records: [{
          Id: parseInt(bedId),
          status_c: "Occupied",
          patient_id_c: patientId
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
          console.error(`Failed to assign patient to bed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error assigning patient to bed:", error?.response?.data?.message || error);
      return null;
    }
  }

  async releasePatient(bedId) {
    try {
      const params = {
        records: [{
          Id: parseInt(bedId),
          status_c: "Available",
          patient_id_c: "",
          last_cleaned_c: new Date().toISOString()
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
          console.error(`Failed to release patient from bed:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error releasing patient from bed:", error?.response?.data?.message || error);
      return null;
    }
  }
}

export default new BedService();