import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class Appointment extends Model {}

Appointment.init(
  {
    
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },


    patient_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    doctor_id: {
      type: DataTypes.UUID,
      allowNull: false,
      references: {
        model: "users",
        key: "id",
      },
    },

    appointment_date: {
      type: DataTypes.DATEONLY,
      allowNull: false,
    },

    appointment_time: {
      type: DataTypes.TIME,
      allowNull: false,
    },

    startTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    endTime: {
      type: DataTypes.TIME,
      allowNull: true,
    },

    duration: {
      type: DataTypes.INTEGER, // duration in minutes
      allowNull: true,
    },

    status: {
      type: DataTypes.ENUM(
        "pending",
        "approved",
        "rejected",
        "completed",
        "cancelled"
      ),
      defaultValue: "pending",
    },

    reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    doctor_notes: {
      type: DataTypes.TEXT,
      allowNull: true,
    },

    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },

    approved_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    approved_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    cancelled_by: {
      type: DataTypes.UUID,
      allowNull: true,
      references: {
        model: "users",
        key: "id",
      },
    },

    cancelled_at: {
      type: DataTypes.DATE,
      allowNull: true,
    },

    cancellation_reason: {
      type: DataTypes.TEXT,
      allowNull: true,
    },
  },
  {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true,
    createdAt: "created_at",
    updatedAt: "updated_at",
  }
);

export default Appointment;