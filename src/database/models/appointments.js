import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class Appointment extends Model {}

Appointment.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    patientId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    appointmentDate: {
        type: DataTypes.DATE,
        allowNull: false
    },
    status: {
        type: DataTypes.ENUM("pending", "confirmed", "cancelled"),
        defaultValue: "pending"
    }
}, {
    sequelize,
    modelName: "Appointment",
    tableName: "appointments",
    timestamps: true
});

export default Appointment;