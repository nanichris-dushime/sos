import sequelize from "../../config/db.js";
import Appointments from "../models/appointments.js";

export const createappointmentsTable = async () => {
    await sequelize.authenticate();
    await Appointments.sync({ alter: true, logging: false });
    console.log("Appointments table created successfully🔥🔥🔥🔥🔥🔥");
}