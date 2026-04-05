import sequelize from "../../config/db.js";
import doctorAvailability from "../models/doctorAvailability.js";

export const createdoctorAvailabilityTable = async () => {
    await sequelize.authenticate();
    await User.sync({ alter: true, logging: false });
    console.log("Doctot Availability table created successfully🔥🔥🔥🔥🔥🔥");
}