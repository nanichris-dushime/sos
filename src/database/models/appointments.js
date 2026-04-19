import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

/** Weekday + string time slot from doctor availability (recurring booking). */
class Appointment extends Model {}

Appointment.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
      field: "doctor_id",
    },
    patientId: {
      type: DataTypes.UUID,
      references: {
        model: "users",
        key: "id",
      },
      allowNull: false,
      field: "patient_id",
    },
    appointmentDay: {
      type: DataTypes.ENUM(...WEEKDAYS),
      allowNull: false,
      field: "appointment_day",
    },
    appointmentTime: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "appointment_time",
    },
    reason: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM("pending", "approved", "completed", "cancelled"),
      allowNull: false,
      defaultValue: "pending",
    },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
  }
);

export default Appointment;

