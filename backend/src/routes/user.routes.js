import { loginUser } from "../controllers/user.controllers.js";
import { registerUser } from "../controllers/user.controllers.js";
import express from "express";
const router = express.Router();
router.post("/register", registerUser);
router.post("/login", loginUser);
export { router };