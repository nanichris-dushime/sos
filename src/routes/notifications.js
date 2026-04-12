import express from "express";
import {
    getAllNotifications,
    getSingleNotification,
    createNotification,
    updateNotification,
    deleteNotification
} from "../controller/notifications.js";

const NotificationRoutes=express.Router();

// Basic notification CRUD routes
NotificationRoutes.get("/notifications", getAllNotifications);
NotificationRoutes.get("/notifications/:id", getSingleNotification);
NotificationRoutes.post("/notifications", createNotification);
NotificationRoutes.put("/notifications/:id", updateNotification);
NotificationRoutes.delete("/notifications/:id", deleteNotification);

export default NotificationRoutes;
