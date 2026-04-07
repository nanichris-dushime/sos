import "./models/users.js";
import "./models/appointments.js";
import "./models/doctorAvailability.js";
import "./models/notifications.js";
import User from "./models/users.js";
import Appointment from "./models/appointments.js";
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