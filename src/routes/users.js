import express from 'express';
import { getAllUsers,singleUser,createUser, updateUser,deleteUser} from "../controller/users.js";
    


const UserRoutes = express.Router();
UserRoutes.get("/api/getAllUsers", getAllUsers);
UserRoutes.get("/api/getSingleUser/:id", singleUser);
UserRoutes.put("/api/updateUser/:id", updateUser);
UserRoutes.post("/api/createUser", createUser);
UserRoutes.delete("/api/removeUser/:id", deleteUser);



export default UserRoutes;