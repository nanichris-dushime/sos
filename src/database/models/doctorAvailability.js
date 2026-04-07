import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";


class DoctorAvailability extends Model {}

DoctorAvailability.init({
    id: {
        type: DataTypes.UUID,
        defaultValue: DataTypes.UUIDV4,
        primaryKey: true
    },
    doctor_id: {
        type: DataTypes.UUID,
        allowNull: false,
        references: {
            model: "users",
            key: "id"
        }
    },
    day: {
        type: DataTypes.ENUM(
            'Monday',
             'Tuesday',
              'Wednesday',
               'Thursday',
                'Friday',
                 'Saturday',
                  'Sunday'),
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
    timestamps: true,

    validate:{
        isValidTimeRange(){
            if(this.startTime >= this.endTime){
                throw new Error("Start time must be before end time");
            }
    }
}


});

export default DoctorAvailability;
