import bedsData from "@/services/mockData/beds.json";

class BedService {
  constructor() {
    this.beds = [...bedsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.beds];
  }

  async getById(id) {
    await this.delay();
    const bed = this.beds.find(b => b.Id === parseInt(id));
    return bed ? { ...bed } : null;
  }

  async create(bedData) {
    await this.delay();
    const newId = Math.max(...this.beds.map(b => b.Id), 0) + 1;
    const newBed = {
      Id: newId,
      id: `B${String(newId).padStart(3, '0')}`,
      ...bedData,
      lastCleaned: new Date().toISOString()
    };
    this.beds.push(newBed);
    return { ...newBed };
  }

  async update(id, bedData) {
    await this.delay();
    const index = this.beds.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.beds[index] = { ...this.beds[index], ...bedData };
      return { ...this.beds[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.beds.findIndex(b => b.Id === parseInt(id));
    if (index !== -1) {
      this.beds.splice(index, 1);
      return true;
    }
    return false;
  }

  async getByWard(ward) {
    await this.delay();
    return this.beds.filter(bed => bed.ward === ward);
  }

  async getAvailableBeds() {
    await this.delay();
    return this.beds.filter(bed => bed.status === "Available");
  }

  async getOccupiedBeds() {
    await this.delay();
    return this.beds.filter(bed => bed.status === "Occupied");
  }

  async assignPatient(bedId, patientId) {
    await this.delay();
    const index = this.beds.findIndex(b => b.Id === parseInt(bedId));
    if (index !== -1) {
      this.beds[index] = {
        ...this.beds[index],
        status: "Occupied",
        patientId: patientId
      };
      return { ...this.beds[index] };
    }
    return null;
  }

  async releasePatient(bedId) {
    await this.delay();
    const index = this.beds.findIndex(b => b.Id === parseInt(bedId));
    if (index !== -1) {
      this.beds[index] = {
        ...this.beds[index],
        status: "Available",
        patientId: null,
        lastCleaned: new Date().toISOString()
      };
      return { ...this.beds[index] };
    }
    return null;
  }
}

export default new BedService();