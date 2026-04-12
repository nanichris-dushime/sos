import sequelize from "../../config/db.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import Notification from "./notifications.js";
import User from "./users.js";

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

// User notifications
User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

// Doctor availability belongs to a doctor user
User.hasMany(DoctorAvailability, { foreignKey: "doctor_id", as: "doctorAvailability" });
DoctorAvailability.belongsTo(User, { foreignKey: "doctor_id", as: "doctor" });

// Doctor availability → appointments
DoctorAvailability.hasMany(Appointment, {
    foreignKey: "doctor_id"
});

Appointment.belongsTo(DoctorAvailability, {
    foreignKey: "doctor_id"
});


export default db;
