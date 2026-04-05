import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class DoctorAvailability extends Model {}

DoctorAvailability.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    doctorId: {
        type: DataTypes.UUID,
        allowNull: false
    },
    day: {
        type: DataTypes.STRING,
        allowNull: false
    },
    startTime: {
        type: DataTypes.TIME,
        allowNull: false
    },
    endTime: {
        type: DataTypes.TIME,
        allowNull: false
    }
}, {
    sequelize,
    modelName: "DoctorAvailability",
    tableName: "doctor_availability",
    timestamps: true
});

export default DoctorAvailability;