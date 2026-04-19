import Appointment from "../models/appointments.js";
import User from "../models/users.js";

export const seedAppointments = async () => {
  try {
    const patients = await User.findAll({ where: { role: "patient" } });
    const doctors = await User.findAll({ where: { role: "doctor" } });

    if (patients.length < 2 || !doctors.length) {
      console.log("Skipping appointment seed: need at least 2 patients and 1 doctor");
      return;
    }

    const patient1 = patients[0];
    const patient2 = patients[1];
    const doctor = doctors[0];

    const appointments = [
      {
        doctorId: doctor.id,
        patientId: patient1.id,
        appointmentDate: "2026-04-10",
        appointmentTime: "09:00-10:00",
        status: "scheduled",
        reason: "General checkup",
      },
      {
        doctorId: doctor.id,
        patientId: patient2.id,
        appointmentDate: "2026-04-11",
        appointmentTime: "10:00-11:00",
        status: "pending",
        reason: "Headache and fever",
      },
      {
        doctorId: doctor.id,
        patientId: patient1.id,
        appointmentDate: "2026-04-12",
        appointmentTime: "14:00-15:00",
        status: "cancelled",
        reason: "Follow-up visit",
      },
      {
        doctorId: doctor.id,
        patientId: patient2.id,
        appointmentDate: "2026-04-13",
        appointmentTime: "09:00-10:00",
        status: "completed",
        reason: "Back pain",
      },
    ];

    await Appointment.bulkCreate(appointments);
    console.log("✅ Appointments seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding appointments:", error);
  }
};
