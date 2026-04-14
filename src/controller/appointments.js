import Appointment from "../database/models/appointments.js";
import Notification from "../database/models/notifications.js";

// Get all appointments
export const getAllAppointments=async(req,res)=>{
    try {
        const appointments=await Appointment.findAll();

        if(appointments.length===0){
            return res.status(404).json({error:"No appointments found"});
        }

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Get a single appointment by id
export const getSingleAppointment=async(req,res)=>{
    try {
        const appointment=await Appointment.findByPk(req.params.id);

        if(!appointment){
            return res.status(404).json({error:"Appointment not found"});
        }

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Create a new appointment
export const createAppointment=async(req,res)=>{
    try {
        // We create the appointment using the data sent from Postman.
        const newAppointment=await Appointment.create(req.body);

        // After creating the appointment, we also notify the doctor.
        await Notification.create({
            userId:newAppointment.doctor_id,
            title:"New Appointment Request",
            message:"A patient has requested an appointment"
        });

        res.status(201).json(newAppointment);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Update an appointment
export const updateAppointment=async(req,res)=>{
    try {
        const appointment=await Appointment.findByPk(req.params.id);

        if(!appointment){
            return res.status(404).json({error:"Appointment not found"});
        }

        // We update only the fields sent in the request body.
        await appointment.update(req.body);

        res.status(200).json(appointment);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Delete an appointment
export const deleteAppointment=async(req,res)=>{
    try {
        const appointment=await Appointment.findByPk(req.params.id);

        if(!appointment){
            return res.status(404).json({error:"Appointment not found"});
        }

        await appointment.destroy();

        res.status(200).json({message:"Appointment deleted successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Get all appointments assigned to one doctor
export const getDoctorAppointments=async(req,res)=>{
    try {
        // We return only appointments where the doctor_id matches the route parameter.
        const appointments=await Appointment.findAll({
            where:{doctor_id:req.params.doctorId}
        });

        res.status(200).json(appointments);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Cancel an appointment and notify the patient
export const cancelAppointment=async(req,res)=>{
    try {
        const appointment=await Appointment.findByPk(req.params.id);

        if(!appointment){
            return res.status(404).json({error:"Appointment not found"});
        }

        // We take the reason from the request body and save it on the appointment.
        const { reason }=req.body;

        await appointment.update({
            status:"cancelled",
            reason:reason,
            cancellation_reason:reason,
            cancelled_at:new Date(),
            cancelled_by:req.user?.id || appointment.doctor_id
        });

        // After cancellation, we create a notification for the patient.
        await Notification.create({
            userId:appointment.patient_id,
            title:"Appointment Cancelled",
            message:`Your appointment was cancelled. Reason: ${reason}`
        });

        res.status(200).json({
            message:"Appointment cancelled successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

//approve an appointment and notify the patient
export const approveAppointment=async(req,res)=>{
    try {
        const appointment=await Appointment.findByPk(req.params.id);

        if(!appointment){
            return res.status(404).json({error:"Appointment not found"});
        }

        await appointment.update({
            status:"approved",
            approved_at:new Date(),
            approved_by:req.user?.id || appointment.doctor_id
        });

        // After approval, we create a notification for the patient.
        await Notification.create({
            userId:appointment.patient_id,
            title:"Appointment Approved",
            message:"Your appointment has been approved by the doctor."
        });

        res.status(200).json({
            message:"Appointment approved successfully",
            appointment
        });
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}   