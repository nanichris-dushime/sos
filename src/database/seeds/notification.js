import Notification from "../models/notifications.js";
import User from "../models/users.js";

export const seedNotifications = async () => {
  try {
    const users = await User.findAll({ limit: 4 });
    if (!users.length) {
      console.log("Skipping notification seed: no users");
      return;
    }

    const [u0, u1, u2, u3] = [users[0], users[1], users[2], users[3]].map(
      (u) => u?.id
    );

    const rows = [];
    if (u0) {
      rows.push({
        userId: u0,
        message: "Your appointment request has been submitted and is pending approval.",
        isRead: false,
      });
    }
    if (u1) {
      rows.push({
        userId: u1,
        message: "You have a new appointment request from a patient.",
        isRead: false,
      });
    }
    if (u0) {
      rows.push({
        userId: u0,
        message: "Your appointment has been approved by the doctor.",
        isRead: false,
      });
    }
    if (u2) {
      rows.push({
        userId: u2,
        message: "Your appointment request was rejected.",
        isRead: true,
      });
    }
    if (u0) {
      rows.push({
        userId: u0,
        message: "Reminder: You have an appointment tomorrow.",
        isRead: false,
      });
    }
    if (u3) {
      rows.push({
        userId: u3,
        message: "Your appointment has been cancelled.",
        isRead: false,
      });
    }

    if (rows.length) await Notification.bulkCreate(rows);
    console.log("Notifications seeded successfully ✅");
  } catch (error) {
    console.error("Error seeding notifications ❌", error);
  }
};
