import DoctorAvailability from "../database/models/doctorAvailability.js";

// Get all doctor availability records
export const getAllDoctorAvailability=async(req,res)=>{
    try {
        const doctorAvailability=await DoctorAvailability.findAll();

        if(doctorAvailability.length===0){
            return res.status(404).json({error:"No doctor availability found"});
        }

        res.status(200).json(doctorAvailability);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Get one doctor availability record by id
export const getSingleDoctorAvailability=async(req,res)=>{
    try {
        const doctorAvailability=await DoctorAvailability.findByPk(req.params.id);

        if(!doctorAvailability){
            return res.status(404).json({error:"Doctor availability not found"});
        }

        res.status(200).json(doctorAvailability);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Create a new doctor availability record
export const createDoctorAvailability=async(req,res)=>{
    try {
        // This saves the doctor's available day and time.
        const doctorAvailability=await DoctorAvailability.create(req.body);
        res.status(201).json(doctorAvailability);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Update a doctor availability record
export const updateDoctorAvailability=async(req,res)=>{
    try {
        const doctorAvailability=await DoctorAvailability.findByPk(req.params.id);

        if(!doctorAvailability){
            return res.status(404).json({error:"Doctor availability not found"});
        }

        await doctorAvailability.update(req.body);

        res.status(200).json(doctorAvailability);
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}

// Delete a doctor availability record
export const deleteDoctorAvailability=async(req,res)=>{
    try {
        const doctorAvailability=await DoctorAvailability.findByPk(req.params.id);

        if(!doctorAvailability){
            return res.status(404).json({error:"Doctor availability not found"});
        }

        await doctorAvailability.destroy();

        res.status(200).json({message:"Doctor availability deleted successfully"});
    } catch (error) {
        res.status(500).json({error:error.message});
    }
}
