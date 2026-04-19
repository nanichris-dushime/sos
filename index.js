import express from "express";
import { DataTypes } from "sequelize";
import sequelize from "./src/config/db.js";
import "dotenv/config";

// Registers models + associations (must load before handling requests)
import "./src/database/models/index.js";

import UserRouter from "./src/routes/user.js";
import AuthRoutes from "./src/routes/auth.js";
import AppointmentRouter from "./src/routes/appointments.js";
import DoctorAvailabilityRouter from "./src/routes/doctorAvailability.js";
import NotificationRouter from "./src/routes/notifications.js";

const app = express();
const PORT = process.env.PORT || 5000;

const ensureDoctorAvailabilitySchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  const table = await queryInterface.describeTable("doctor_availability");

  if (!table.day) {
    await queryInterface.addColumn("doctor_availability", "day", {
      type: DataTypes.ENUM(
        "Monday",
        "Tuesday",
        "Wednesday",
        "Thursday",
        "Friday",
        "Saturday",
        "Sunday"
      ),
      allowNull: false,
      defaultValue: "Monday",
    });
  }

  if (!table.available) {
    await queryInterface.addColumn("doctor_availability", "available", {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    });
  }

  // Legacy SOS schema required explicit time range columns. Keep them nullable so
  // the new weekday-based availability rows can be inserted without those fields.
  if (table.startTime) {
    await queryInterface.changeColumn("doctor_availability", "startTime", {
      type: DataTypes.TIME,
      allowNull: true,
    });
  }

  if (table.endTime) {
    await queryInterface.changeColumn("doctor_availability", "endTime", {
      type: DataTypes.TIME,
      allowNull: true,
    });
  }
};

/** Older DBs may have `notifications.title` NOT NULL; relax so API can omit title. */
const ensureNotificationsSchema = async () => {
  const queryInterface = sequelize.getQueryInterface();
  try {
    const table = await queryInterface.describeTable("notifications");
    const col = table.title;
    if (col && col.allowNull === false) {
      await queryInterface.changeColumn("notifications", "title", {
        type: DataTypes.STRING,
        allowNull: true,
      });
    }
  } catch {
    // notifications table may not exist yet on first run; ignore
  }
};

app.use(express.json());

// Santech-style: same routers at / and under /user (e.g. /api/users and /user/api/users)
app.use("/", UserRouter);
app.use("/user", UserRouter);
app.use("/", AuthRoutes);
app.use("/user", AuthRoutes);
app.use("/", AppointmentRouter);
app.use("/", DoctorAvailabilityRouter);
app.use("/", NotificationRouter);
app.use("/user", AppointmentRouter);
app.use("/user", DoctorAvailabilityRouter);
app.use("/user", NotificationRouter);

sequelize
  .authenticate()
  .then(() => ensureDoctorAvailabilitySchema())
  .then(() => ensureNotificationsSchema())
  .then(() => sequelize.sync())
  .then(() => {
    app.listen(PORT, () => {
      console.log(`Server is running on http://localhost:${PORT}`);
      console.log("Database connected successfully");
    });
  })
  .catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
  });
