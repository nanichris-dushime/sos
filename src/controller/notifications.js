import Notification from "../database/models/notifications.js";

// Get all notifications
export const getAllNotifications=async(req,res)=>{
    try {
        const notifications=await Notification.findAll();

        if(notifications.length===0){
            return res.status(404).json({error:"No notifications found"});
        }

        res.status(200).json(notifications);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Get one notification by id
export const getSingleNotification=async(req,res)=>{
    try {
        const notification=await Notification.findByPk(req.params.id);

        if(!notification){
            return res.status(404).json({error:"Notification not found"});
        }

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Create a notification
export const createNotification=async(req,res)=>{
    try {
        // This creates a new notification record from Postman request data.
        const notification=await Notification.create(req.body);
        res.status(201).json(notification);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Update a notification
export const updateNotification=async(req,res)=>{
    try {
        const notification=await Notification.findByPk(req.params.id);

        if(!notification){
            return res.status(404).json({error:"Notification not found"});
        }

        await notification.update(req.body);

        res.status(200).json(notification);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Delete a notification
export const deleteNotification=async(req,res)=>{
    try {
        const notification=await Notification.findByPk(req.params.id);

        if(!notification){
            return res.status(404).json({error:"Notification not found"});
        }

        await notification.destroy();

        res.status(200).json({message:"Notification deleted successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
