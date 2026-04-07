import Notification from "../models/notifications.js";


export const seedNotifications = async () => {
  try {
    const data = [
      {
        userId: "10bbe67d-3b45-4cf5-bccb-2d8964e56eb",
        title: "Appointment Requested",
        message: "Your appointment request has been submitted and is pending approval.",
        isRead: false
      },
      {
        userId: "c424d3aa-9c4d-482c-a1d3-1a1b3dde1a4",
        title: "New Appointment Request",
        message: "You have a new appointment request from a patient.",
        isRead: false
      },
      {
        userId: "10bbe67d-3b45-4cf5-bccb-2d8964e56eb",
        title: "Appointment Approved",
        message: "Your appointment has been approved by the doctor.",
        isRead: false
      },
      {
        userId: "1d050f8c-ba68-40af-96d5-13f2ecedd69f",
        title: "Appointment Rejected",
        message: "Your appointment request was rejected.",
        isRead: true
      },
      {
        userId: "10bbe67d-3b45-4cf5-bccb-2d8964e56eb",
        title: "Appointment Reminder",
        message: "Reminder: You have an appointment tomorrow.",
        isRead: false
      },
      {
        userId: "1d050f8c-ba68-40af-96d5-13f2ecedd69f",
        title: "Appointment Cancelled",
        message: "Your appointment has been cancelled.",
        isRead: false
      },
      {
        userId: "c424d3aa-9c4d-482c-a1d3-1a1b3dde1a4",
        title: "Upcoming Appointment",
        message: "You have an appointment scheduled today.",
        isRead: false
      }
    ];

    await Notification.bulkCreate(data);

    console.log("Notifications seeded successfully ✅");
  } catch (error) {
    console.error("Error seeding notifications ❌", error);
  }
};