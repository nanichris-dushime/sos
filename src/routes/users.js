import express from 'express';
import { getAllUsers,singleUser,createUser, updateUser,deleteUser} from "../controller/users.js";
    


const router = express.Router();
router.get("api/getAllUsers", getAllUsers);
router.get("api/getSingleUser/{id}", singleUser);
router.put("api/updateUser/{id}", updateUser);
router.post("api/createUser", createUser);
router.delete("api/removeUser/{id}", deleteUser);



export default router;