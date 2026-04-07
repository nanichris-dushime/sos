import User from "../models/users.js";
import bcrypt from 'bcrypt'
export const seedUsers=async()=>{
    const hashPassword=await bcrypt.hash('defaultpassword123', 10);
    const users=[
        {
            fullName:'DUSHIME',
            email:'dushimenani@gmail.com',
            phoneNumber:'0788306030',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:"250792835100",
            password:hashPassword
            
        },
          {
            fullName:'NANI',
            email:'nani@gmail.com',
            phoneNumber:'0788306031',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:"250792835102",
            password:hashPassword
            
        },  {
            fullName:'CHRIS',
            email:'chris@gmail.com',
            phoneNumber:'0788306032',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:"250792835101",
            password:hashPassword
            
        }
    ]
    await User.bulkCreate(users);
}