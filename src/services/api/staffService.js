import { toast } from "react-toastify";

class StaffService {
  constructor() {
    this.tableName = 'staff_c';
  }

  async getAll() {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
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
      console.error("Error fetching staff:", error?.response?.data?.message || error);
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
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
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
      console.error(`Error fetching staff record ${id}:`, error?.response?.data?.message || error);
      return null;
    }
  }

  async create(staffData) {
    try {
      const params = {
        records: [{
          Name: staffData.name_c || staffData.name || '',
          id_c: staffData.id_c || '',
          name_c: staffData.name_c || staffData.name || '',
          role_c: staffData.role_c || staffData.role || '',
          department_c: staffData.department_c || staffData.department || '',
          shift_c: staffData.shift_c || staffData.shift || '',
          contact_c: staffData.contact_c || staffData.contact || '',
          specialization_c: staffData.specialization_c || staffData.specialization || ''
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
          console.error(`Failed to create ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error creating staff record:", error?.response?.data?.message || error);
      return null;
    }
  }

  async update(id, staffData) {
    try {
      const params = {
        records: [{
          Id: parseInt(id),
          Name: staffData.name_c || staffData.name || '',
          id_c: staffData.id_c || '',
          name_c: staffData.name_c || staffData.name || '',
          role_c: staffData.role_c || staffData.role || '',
          department_c: staffData.department_c || staffData.department || '',
          shift_c: staffData.shift_c || staffData.shift || '',
          contact_c: staffData.contact_c || staffData.contact || '',
          specialization_c: staffData.specialization_c || staffData.specialization || ''
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
          console.error(`Failed to update ${failed.length} staff records:`, failed);
          failed.forEach(record => {
            if (record.message) toast.error(record.message);
          });
        }
        return successful.length > 0 ? successful[0].data : null;
      }
    } catch (error) {
      console.error("Error updating staff record:", error?.response?.data?.message || error);
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
      console.error("Error deleting staff record:", error?.response?.data?.message || error);
      return false;
    }
  }

  async getByDepartment(department) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
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
      console.error("Error fetching staff by department:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByRole(role) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        where: [{"FieldName": "role_c", "Operator": "EqualTo", "Values": [role]}]
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
      console.error("Error fetching staff by role:", error?.response?.data?.message || error);
      return [];
    }
  }

  async getByShift(shift) {
    try {
      const params = {
        fields: [
          {"field": {"Name": "Name"}},
          {"field": {"Name": "id_c"}},
          {"field": {"Name": "name_c"}},
          {"field": {"Name": "role_c"}},
          {"field": {"Name": "department_c"}},
          {"field": {"Name": "shift_c"}},
          {"field": {"Name": "contact_c"}},
          {"field": {"Name": "specialization_c"}}
        ],
        where: [{"FieldName": "shift_c", "Operator": "EqualTo", "Values": [shift]}]
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
      console.error("Error fetching staff by shift:", error?.response?.data?.message || error);
      return [];
    }
  }
}

export default new StaffService();