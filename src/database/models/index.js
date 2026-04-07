import sequelize from "../../config/db.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import User from "./users.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";

const db={
    sequelize,
    User,
    Appointment,
    DoctorAvailability,
    Notification,
    
}

// Patient
User.hasMany(Appointment, { foreignKey: "patient_id" });
Appointment.belongsTo(User, { foreignKey: "patient_id", as: "patient" });
// Doctor
User.hasMany(Appointment, { foreignKey: "doctor_id" });
Appointment.belongsTo(User, { foreignKey: "doctor_id", as: "doctor" });
// Approved by
Appointment.belongsTo(User, { foreignKey: "approved_by", as: "approver" });
// Cancelled by
Appointment.belongsTo(User, { foreignKey: "cancelled_by", as: "canceller" });

// Doctor availability → appointments
DoctorAvailability.hasMany(Appointment, {
    foreignKey: "doctor_id"
});

Appointment.belongsTo(DoctorAvailability, {
    foreignKey: "doctor_id"
});


export default db;