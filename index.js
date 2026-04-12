import express from "express";
import "dotenv/config";

import sequelize from "./src/config/db.js";
import "./src/database/models/index.js";
import UserRoutes from "./src/routes/users.js";
import AuthRoutes from "./src/routes/auth.js";
import AppointmentRoutes from "./src/routes/appointments.js";
import NotificationRoutes from "./src/routes/notifications.js";
import DoctorAvailabilityRoutes from "./src/routes/doctorAvailability.js";
const app = express();
const PORT = process.env.PORT;

app.use(express.json());
app.use(UserRoutes);
app.use(AuthRoutes);
app.use(AppointmentRoutes);
app.use(NotificationRoutes);
app.use(DoctorAvailabilityRoutes);


sequelize.authenticate()
.then(() => sequelize.sync())
.then(() => {
    app.listen(PORT, () => {
        console.log(`Your database is running🔥🔥🔥🔥`);
        console.log(`Server is running on http://localhost:${PORT}`);

    });
})
.catch((err) => {
    console.error("Unable to connect to the database:", err);
    process.exit(1);
});
