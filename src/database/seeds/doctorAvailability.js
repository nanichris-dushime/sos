import DoctorAvailability from "../models/doctorAvailability.js";

export const seedDoctorAvailability = async () => {
  try {
    const data = [
      {
        doctor_id: "3d669dcd-be2f-417e-8523-f70757a8f0c5",
        day: "Monday",
        startTime: "08:00:00",
        endTime: "17:00:00"
      },
      {
        doctor_id: "c424d3aa-9c4d-482c-a1d3-1a1b3dde1a4b",
        day: "Tuesday",
        startTime: "08:00:00",
        endTime: "17:00:00"
      }
      ];

    await DoctorAvailability.bulkCreate(data);

    console.log("Doctor availability seeded successfully ✅");
  } catch (error) {
    console.error("Error seeding doctor availability ❌", error);
  }
};