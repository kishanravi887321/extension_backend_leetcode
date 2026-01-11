import express from "express";
import { getProfile, updateProfile, uploadProfileImage, uploadCoverImage, getUserByUsername } from "../controllers/profile.controllers.js";
import { authenticateToken } from "../middleware/auth.middleware.js";
import { upload } from "../middleware/upload.middleware.js";

const router = express.Router();

// Protected routes (require authentication)
router.get("/me", authenticateToken, getProfile);
router.put("/update", authenticateToken, updateProfile);
router.post("/upload-image", authenticateToken, upload.single('image'), uploadProfileImage);
router.post("/upload-cover", authenticateToken, upload.single('image'), uploadCoverImage);

// Public routes
router.get("/user/:username", getUserByUsername);

export { router };
