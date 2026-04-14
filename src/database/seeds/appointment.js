import Appointment from "../models/appointments.js";
import DoctorAvailability from "../models/doctorAvailability.js";
import User from "../models/users.js";

export const seedAppointments = async () => {
  try {
    // Get users from DB
    const users = await User.findAll();

    if (users.length < 2) {
      console.log("❌ Not enough users to create appointments");
      return;
    }

    // Assign roles (for demo)
    const patient1 = users[0];
    const patient2 = users[1];
    const doctor = users[2]; // assume 3rd user is doctor

    const appointments = [
      {
        
        patient_id: patient1.id,
        doctor_id: doctor.id,
        appointment_date: "2026-04-10",
        appointment_time: "10:00:00",
        start_time: "10:05:00",
        end_time: "10:30:00",
        duration: 25,
        status: "approved",
        reason: "General checkup",
        doctor_notes: "Patient is stable",
        location: "Kigali Health Center",
        approved_by: doctor.id,
        approved_at: new Date(),
      },

      {
        patient_id: patient2.id,
        doctor_id: doctor.id,
        appointment_date: "2026-04-11",
        appointment_time: "14:00:00",
        status: "pending",
        reason: "Headache and fever",
        location: "Online Consultation",
      },

      {
        patient_id: patient1.id,
        doctor_id: doctor.id,
        appointment_date: "2026-04-12",
        appointment_time: "09:00:00",
        status: "cancelled",
        reason: "Follow-up visit",
        cancelled_by: patient1.id,
        cancelled_at: new Date(),
        cancellation_reason: "Feeling better, no longer needed",
      },

      {
        patient_id: patient2.id,
        doctor_id: doctor.id,
        appointment_date: "2026-04-13",
        appointment_time: "16:00:00",
        start_time: "16:10:00",
        end_time: "16:40:00",
        duration: 30,
        status: "completed",
        reason: "Back pain",
        doctor_notes: "Prescribed medication",
        location: "Kigali Hospital",
        approved_by: doctor.id,
        approved_at: new Date(),
      },
    ];

    await Appointment.bulkCreate(appointments);

    console.log("✅ Appointments seeded successfully");
  } catch (error) {
    console.error("❌ Error seeding appointments:", error);
  }
};