import User from "../models/users.js";
import bcrypt from 'bcrypt'
export const seedUsers=async()=>{
    const hashPassword=await bcrypt.hash('defaultpassword123', 10);
    const users=[
        {
            fullName:'DUSHIME',
            email:'dushimen@gmail.com',
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
            email:'naichr@gmail.com',
            phoneNumber:'0788306031',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:"250792835102",
            password:hashPassword
            
        },  {
            fullName:'CHRIS',
            email:'dushimechriss@gmail.com',
            phoneNumber:'0788306032',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-2005',
            location:'muhanga',
            emergency_contact:"250792835101",
            password:hashPassword
            
        },// Doctor user
     {
            fullName:'DR. SMITH',
            email:'smith@gmail.com',
            phoneNumber:'0788306033',
            gender:'male',
            status:'active',
            date_of_birth:'12-02-1980',
            location:'kigali',
            emergency_contact:"250792835103",
            password:hashPassword,
            role:'doctor'
            
        },

    {
            fullName:'DR. JANE DOE',
            email:'jane@gmail.com',
            phoneNumber:'0788306034',
            gender:'female',
            status:'active',
            date_of_birth:'12-02-1985',
            location:'kigali',
            emergency_contact:"250792835104",
            password:hashPassword,
            role:'doctor'
    },
    {
        fullName:"Administrator",
        email:"admin@outlook.com",
        phoneNumber:"0788306035",
        gender:"male",
        role:"admin",
        status:"active",
        date_of_birth:"01-01-1990",
        location:"kigali",
        emergency_contact:"250792835105",
        password:hashPassword
    }
    
    ]
    await User.bulkCreate(users);
}