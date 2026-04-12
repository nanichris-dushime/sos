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
DoctorAvailabilityRoutes.get("/doctorAvailability", getAllDoctorAvailability);
DoctorAvailabilityRoutes.get("/doctorAvailability/:id", getSingleDoctorAvailability);
DoctorAvailabilityRoutes.post("/doctorAvailability", createDoctorAvailability);
DoctorAvailabilityRoutes.put("/doctorAvailability/:id", updateDoctorAvailability);
DoctorAvailabilityRoutes.delete("/doctorAvailability/:id", deleteDoctorAvailability);

export default DoctorAvailabilityRoutes;
