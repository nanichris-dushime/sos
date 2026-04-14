import express from "express";
import protect from "../middleware/auth.js";
import {
    getAllAppointments,
    getSingleAppointment,
    createAppointment,
    updateAppointment,
    deleteAppointment,
    getDoctorAppointments,
    cancelAppointment,
    approveAppointment,
    

} from "../controller/appointments.js";

const AppointmentRoutes=express.Router();

// Basic appointment CRUD routes
AppointmentRoutes.get("/api/appointments", getAllAppointments);
AppointmentRoutes.get("/api/appointments/:id", getSingleAppointment);
AppointmentRoutes.post("/api/appointments", createAppointment);
AppointmentRoutes.put("/api/appointments/:id", updateAppointment);
AppointmentRoutes.delete("/api/appointments/:id", deleteAppointment);

// This route returns appointments assigned to one doctor.
AppointmentRoutes.get("/api/doctor/appointments/:doctorId", getDoctorAppointments);

// This route lets a doctor cancel an appointment and notify the patient.
AppointmentRoutes.put("/api/appointments/cancel/:id", protect, cancelAppointment);
//This rout leta a doctor accept an appointment and notify the patient.
AppointmentRoutes.put("/api/appointments/approve/:id", protect, approveAppointment);

export default AppointmentRoutes;
