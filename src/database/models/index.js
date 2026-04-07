import sequelize from "../../config/db.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import User from "./users.js";

const db={
    sequelize,
    User,
    Appointment,
    DoctorAvailability,
    Notification,
    
}
export default db;