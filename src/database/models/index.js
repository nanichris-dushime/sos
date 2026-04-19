import sequelize from "../../config/db.js";
import User from "./users.js";
import Appointment from "./appointments.js";
import DoctorAvailability from "./doctorAvailability.js";
import Notification from "./notifications.js";

// Associations (santech-style domain: appointments tie to users + availability is per-date slots)
User.hasMany(Appointment, { foreignKey: "doctorId", as: "doctorAppointments" });
User.hasMany(Appointment, { foreignKey: "patientId", as: "patientAppointments" });
Appointment.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });
Appointment.belongsTo(User, { foreignKey: "patientId", as: "patient" });

User.hasMany(DoctorAvailability, { foreignKey: "doctorId", as: "doctorAvailability" });
DoctorAvailability.belongsTo(User, { foreignKey: "doctorId", as: "doctor" });

User.hasMany(Notification, { foreignKey: "userId", as: "notifications" });
Notification.belongsTo(User, { foreignKey: "userId", as: "user" });

const db = {
  sequelize,
  User,
  Appointment,
  DoctorAvailability,
  Notification,
};

export default db;
