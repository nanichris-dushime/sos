import User from "../database/models/users.js";
import bcrypt from 'bcrypt';

//Get all users
export const getAllUsers=async(req,res)=>{
    try {
        const users=await User.findAll();
        if(!user){
            return res.status(404).json({error:'No users found'})
        }
        res.status(200).json(users);
        console.log("All users",users)
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}

//Get single id
export const singleUser=async(req,res)=>{
    try {
        const user=await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({error:'User not found'})
        }
        res.status(200).json(`We get user called${user}`);
    } catch (error) {
        res.status(500).json({error:error.message})

    }
}
//Create user
export const createUser=async(req,res)=>{
    try {
        const {password,...userData}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
        const newUser=await User.create({
            ...userData,
            password:hashPassword
        });
        res.status(201).json(newUser);
    } 
    catch (error) {
        res.status(500).json({error:error.message}) 
    }
}
//Update user
export const updateUser=async(req,res)=>{
    try {
        const user=await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({error:'User not found'})
        }
        const {password,...userData}=req.body;
        const hashPassword=await bcrypt.hash(password,10);
        await user.update({
            ...userData,
            password:hashPassword
        });
        res.status(200).json(user);
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}
//Update user
export const deleteUser=async(req,res)=>{
    try {
        const user=await User.findByPk(req.params.id);
        if(!user){
            return res.status(404).json({error:'User not found'})
        }
        await user.destroy();
        res.status(200).json({message:'User deleted successfully'})
    } catch (error) {
        res.status(500).json({error:error.message})
    }
}