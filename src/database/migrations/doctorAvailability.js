import sequelize from "../../config/db.js";
import DoctorAvailability from "../models/doctorAvailability.js";


export const createDoctorAvailabilityTable = async () => {
    await sequelize.authenticate();
    await DoctorAvailability.sync({ alter: true, logging: false });
    console.log("Doctor Availability table created successfully🔥🔥🔥🔥🔥🔥");
}