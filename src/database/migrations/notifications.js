import sequelize from "../../config/db.js";
import Notifications from "../models/notifications.js";

export const createNotificationTable = async () => {
    await sequelize.authenticate();
    await Notifications.sync({ alter: true, logging: false });
    console.log("Notifications table created successfully🔥🔥🔥🔥🔥🔥");
}