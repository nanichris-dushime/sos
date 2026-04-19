import jwt from "jsonwebtoken";

const protect=(req,res,next)=>{
    const authHeader=req.headers.authorization;
    if(!authHeader?.startsWith('Bearer '))
        return res.status(401).json({message:"No token provided"});

    const token=authHeader.split(' ')[1];
    try {
        req.user=jwt.verify(token,process.env.JWT_SECRET);
        next();
        
    } catch (error) {
        return res.status(401).json({ message: "Invalid or expired token" });
    }
}

// This middleware checks if the logged in user is an admin.
// We use it on routes that should only be accessed by admins.
export const isAdmin=(req,res,next)=>{
    if(!req.user){
        return res.status(401).json({message:"Unauthorized"});
    }

    if(req.user.role!=="admin"){
        return res.status(403).json({message:"Access denied. Admin only"});
    }

    next();
}
export default protect;
