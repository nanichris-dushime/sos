import { DataTypes, Model } from "sequelize";
import sequelize from "../../config/db.js";

class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.UUID,
      defaultValue: DataTypes.UUIDV4,
      primaryKey: true,
      allowNull: false,
    },
    // API uses santech names; DB may still use original SOS column names — map with `field`.
    fullname: {
      type: DataTypes.STRING,
      allowNull: false,
      field: "fullName",
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    password: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    dob: {
      type: DataTypes.DATEONLY,
      allowNull: true,
      field: "date_of_birth",
    },
    gender: {
      type: DataTypes.ENUM("male", "female", "other"),
      allowNull: true,
    },
    profilePicture: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "profile_image",
    },
    status: {
      // Keep legacy DB values compatible during `sync({ alter: true })`
      // (older SOS data may contain `blocked`; some reference data used `broked`).
      type: DataTypes.ENUM("active", "inactive", "blocked", "broked"),
      allowNull: false,
      defaultValue: "active",
    },
    emergencyContact: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "emergency_contact",
    },
    PhoneNumber: {
      type: DataTypes.STRING,
      allowNull: true,
      field: "phoneNumber",
    },
    location: {
      type: DataTypes.STRING,
      allowNull: true,
    },
    role: {
      type: DataTypes.ENUM("patient", "doctor", "admin"),
      allowNull: false,
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
    modelName: "User",
    tableName: "users",
    timestamps: true,
  }
);

export default User;
