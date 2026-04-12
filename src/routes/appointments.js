import express from "express";
import protect from "../middleware/auth.js";
import {
    getAllAppointments,
    getSingleAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getDoctorAppointments,
    cancelAppointment
} from "../controller/appointments.js";

const AppointmentRoutes=express.Router();

// Basic appointment CRUD routes
AppointmentRoutes.get("/appointments", getAllAppointments);
AppointmentRoutes.get("/appointments/:id", getSingleAppointment);
AppointmentRoutes.post("/appointments", createAppointment);
AppointmentRoutes.put("/appointments/:id", updateAppointment);
AppointmentRoutes.delete("/appointments/:id", deleteAppointment);

// This route returns appointments assigned to one doctor.
AppointmentRoutes.get("/doctor/appointments/:doctorId", getDoctorAppointments);

// This route lets a doctor cancel an appointment and notify the patient.
AppointmentRoutes.put("/appointments/cancel/:id", protect, cancelAppointment);

export default AppointmentRoutes;
