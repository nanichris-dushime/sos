import express from "express";
import {
    getAllDoctorAvailability,
    getSingleDoctorAvailability,
    createDoctorAvailability,
    updateDoctorAvailability,
    deleteDoctorAvailability
} from "../controller/doctorAvailability.js";

const DoctorAvailabilityRoutes=express.Router();

// Basic doctor availability CRUD routes
DoctorAvailabilityRoutes.get("/api/doctorAvailability", getAllDoctorAvailability);
DoctorAvailabilityRoutes.get("/api/doctorAvailability/:id", getSingleDoctorAvailability);
DoctorAvailabilityRoutes.post("/api/doctorAvailability", createDoctorAvailability);
DoctorAvailabilityRoutes.put("/api/doctorAvailability/:id", updateDoctorAvailability);
DoctorAvailabilityRoutes.delete("/api/doctorAvailability/:id", deleteDoctorAvailability);

export default DoctorAvailabilityRoutes;
