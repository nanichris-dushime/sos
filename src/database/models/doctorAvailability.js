import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

/** Recurring weekday availability: which day the doctor takes patients and on/off flag. */
class DoctorAvailability extends Model {}

const WEEKDAYS = [
  "Monday",
  "Tuesday",
  "Wednesday",
  "Thursday",
  "Friday",
  "Saturday",
  "Sunday",
];

DoctorAvailability.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    doctorId: {
      type: DataTypes.UUID,
      allowNull: false,
      // MySQL table still uses legacy column name from earlier schema
      field: "doctor_id",
    },
    day: {
      type: DataTypes.ENUM(...WEEKDAYS),
      allowNull: false,
    },
    available: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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
    modelName: "DoctorAvailability",
    tableName: "doctor_availability",
    timestamps: true,
    // No DB unique index here: Sequelize emits index columns as attribute names (`doctorId`),
    // which breaks when `field: "doctor_id"` maps the column. Uniqueness is enforced in the controller.
  }
);

export default DoctorAvailability;
