import { loginUser, googleLogin, refreshToken, logout } from "../controllers/user.controllers.js";
import express from "express";
const router = express.Router();
router.post("/login", loginUser);
router.post("/google-login", googleLogin);
router.post("/refresh-token", refreshToken);
router.post("/logout", logout);
export { router };