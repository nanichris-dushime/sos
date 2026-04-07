import Appointment from "../models/appointments.js";


export const seedAppointment=async()=>{
    const appointments=[
        {
            patient_id:'1',
            doctor_id:'2',
            appointment_date:'2024-07-01',
            appointment_time:'10:00:00',
            reason:'Regular check-up',
            location:'Room 101'
        },
        {
            patient_id:'2',
            doctor_id:'3',
            appointment_date:'2024-07-02',
            appointment_time:'11:00:00',
            reason:'Flu symptoms',
            location:'Room 102'
        },
        {
            patient_id:'3',
            doctor_id:'1',
            appointment_date:'2024-07-03',
            appointment_time:'12:00:00',
            reason:'Back pain',
            location:'Room 103'
        }
    ]
    await Appointment.bulkCreate(appointments);
}