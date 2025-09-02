import appointmentsData from "@/services/mockData/appointments.json";

class AppointmentService {
  constructor() {
    this.appointments = [...appointmentsData];
  }

  async delay() {
    return new Promise(resolve => setTimeout(resolve, Math.random() * 300 + 200));
  }

  async getAll() {
    await this.delay();
    return [...this.appointments];
  }

  async getById(id) {
    await this.delay();
    const appointment = this.appointments.find(a => a.Id === parseInt(id));
    return appointment ? { ...appointment } : null;
  }

  async create(appointmentData) {
    await this.delay();
    const newId = Math.max(...this.appointments.map(a => a.Id), 0) + 1;
    const newAppointment = {
      Id: newId,
      id: `A${String(newId).padStart(3, '0')}`,
      ...appointmentData,
      status: "Scheduled"
    };
    this.appointments.push(newAppointment);
    return { ...newAppointment };
  }

  async update(id, appointmentData) {
    await this.delay();
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.appointments[index] = { ...this.appointments[index], ...appointmentData };
      return { ...this.appointments[index] };
    }
    return null;
  }

  async delete(id) {
    await this.delay();
    const index = this.appointments.findIndex(a => a.Id === parseInt(id));
    if (index !== -1) {
      this.appointments.splice(index, 1);
      return true;
    }
    return false;
  }

  async getByDateRange(startDate, endDate) {
    await this.delay();
    return this.appointments.filter(appointment => {
      const appointmentDate = new Date(appointment.dateTime);
      return appointmentDate >= new Date(startDate) && appointmentDate <= new Date(endDate);
    });
  }

  async getByDepartment(department) {
    await this.delay();
    return this.appointments.filter(appointment => appointment.department === department);
  }

  async getTodaysAppointments() {
    await this.delay();
    const today = new Date().toISOString().split('T')[0];
    return this.appointments.filter(appointment => 
      appointment.dateTime.startsWith(today)
    );
  }
}

export default new AppointmentService();