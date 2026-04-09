import express from "express";
import { Register,Login } from "../controller/auth.js";

const AuthRoutes=express.Router();

AuthRoutes.post("/api/register",Register);
AuthRoutes.post("/api/login",Login);
export default AuthRoutes;