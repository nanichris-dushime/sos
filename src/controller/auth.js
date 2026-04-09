import bcrypt from "bcrypt"
import jwt from "jsonwebtoken"
import User from "../database/models/users.js"

export const Register=async(req,res)=>{
    try {
        const {password, ...userData}=req.body;
        const existing=await User.findOne({where:{email:userData.email}})
        if(existing)
            return res.status(404).json({message:"User/Account arleady exist"});

        const hashPassWord= await bcrypt.hash(password,10);
        const userAccount=await User.create({...userData,password:hashPassWord});
        res.status(201).json({message:"User account created successfully", userAccount});
    } catch (error) {
        res.status(500).json({error:error.message});
        
    }
};


// Make Login
export const Login=async(req,res)=>{
 try {
    const {email,password}=req.body;
    // check if user exist in database
    const user=await User.findOne({where:{email}});
    if(!user)
        return res.status(404).json({message:"User try to login but there is no account found in tht system"});
    //compare user input and exist one
    const isMatch=await bcrypt.compare(password,user.password);
    if(!isMatch)
        return res.status(401).json({message:"Invalid credentials"});
   //define token and what it will have 
    const token=jwt.sign(
        {id:user.id,role:user.role,fullName:user.fullName,phoneNumber:user.phoneNumber,email:user.email},
        process.env.JWT_SECRET,{expiresIn:'1d'}
    )
    res.status(200).json({message:"Login successfully",token});
 } catch (error) {
    res.status(500).json({error:error.message});
 }
}