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
NotificationRoutes.get("/api/notifications", getAllNotifications);
NotificationRoutes.get("/api/notifications/:id", getSingleNotification);
NotificationRoutes.post("/api/notifications", createNotification);
NotificationRoutes.put("/api/notifications/:id", updateNotification);
NotificationRoutes.delete("/api/notifications/:id", deleteNotification);

export default NotificationRoutes;
