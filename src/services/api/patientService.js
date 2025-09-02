import patientsData from "@/services/mockData/patients.json";

class PatientService {
  constructor() {
    this.patients = [...patientsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.patients];
  }

  async getById(id) {
    await this.delay();
    const patient = this.patients.find(p => p.Id === parseInt(id));
    return patient ? { ...patient } : null;
  }

  async create(patientData) {
    await this.delay();
    const newId = Math.max(...this.patients.map(p => p.Id), 0) + 1;
    const newPatient = {
      Id: newId,
      id: `P${String(newId).padStart(3, '0')}`,
      ...patientData,
      admissionDate: new Date().toISOString().split('T')[0]
    };
    this.patients.push(newPatient);
    return { ...newPatient };
  }

  async update(id, patientData) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients[index] = { ...this.patients[index], ...patientData };
      return { ...this.patients[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.patients.findIndex(p => p.Id === parseInt(id));
    if (index !== -1) {
      this.patients.splice(index, 1);
      return true;
    }
    return false;
  }

  async search(query) {
    await this.delay();
    const lowerQuery = query.toLowerCase();
    return this.patients.filter(patient =>
      patient.name.toLowerCase().includes(lowerQuery) ||
      patient.id.toLowerCase().includes(lowerQuery) ||
      patient.contact.includes(query)
    );
  }

  async getByStatus(status) {
    await this.delay();
    return this.patients.filter(patient => patient.status === status);
  }
}

export default new PatientService();