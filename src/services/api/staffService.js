import staffData from "@/services/mockData/staff.json";

class StaffService {
  constructor() {
    this.staff = [...staffData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.staff];
  }

  async getById(id) {
    await this.delay();
    const staffMember = this.staff.find(s => s.Id === parseInt(id));
    return staffMember ? { ...staffMember } : null;
  }

  async create(staffData) {
    await this.delay();
    const newId = Math.max(...this.staff.map(s => s.Id), 0) + 1;
    const prefix = staffData.role === "Doctor" ? "D" : staffData.role === "Nurse" ? "N" : "A";
    const newStaff = {
      Id: newId,
      id: `${prefix}${String(newId).padStart(3, '0')}`,
      ...staffData
    };
    this.staff.push(newStaff);
    return { ...newStaff };
  }

  async update(id, staffData) {
    await this.delay();
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.staff[index] = { ...this.staff[index], ...staffData };
      return { ...this.staff[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.staff.findIndex(s => s.Id === parseInt(id));
    if (index !== -1) {
      this.staff.splice(index, 1);
      return true;
    }
    return false;
  }

  async getByDepartment(department) {
    await this.delay();
    return this.staff.filter(staffMember => staffMember.department === department);
  }

  async getByRole(role) {
    await this.delay();
    return this.staff.filter(staffMember => staffMember.role === role);
  }

  async getByShift(shift) {
    await this.delay();
    return this.staff.filter(staffMember => staffMember.shift === shift);
  }
}

export default new StaffService();