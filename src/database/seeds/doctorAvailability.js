import DoctorAvailability from "../models/doctorAvailability.js";
import User from "../models/users.js";

export const seedDoctorAvailability = async () => {
  try {
    const doctors = await User.findAll({ where: { role: "doctor" } });
    if (!doctors.length) {
      console.log("Skipping doctor availability seed: no doctors in DB");
      return;
    }

    const rows = doctors.flatMap((doc) => [
      { doctorId: doc.id, day: "Monday", available: true },
      { doctorId: doc.id, day: "Wednesday", available: true },
      { doctorId: doc.id, day: "Friday", available: true },
      { doctorId: doc.id, day: "Sunday", available: false },
    ]);

    await DoctorAvailability.bulkCreate(rows);
    console.log("Doctor availability seeded successfully ✅");
  } catch (error) {
    console.error("Error seeding doctor availability ❌", error);
  }
};
