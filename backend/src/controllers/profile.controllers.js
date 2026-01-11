import User from "../models/User.models.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password -googleId');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        picture: user.picture,
        bio: user.bio || '',
        createdAt: user.createdAt,
      }
    });
  } catch (error) {
    console.error("Get profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Update user profile
export const updateProfile = async (req, res) => {
  try {
    const { name, username, bio } = req.body;
    const userId = req.user.id;
    
    // Check if username is already taken by another user
    if (username) {
      const existingUser = await User.findOne({ 
        username: username.toLowerCase().trim(), 
        _id: { $ne: userId } 
      });
      
      if (existingUser) {
        return res.status(400).json({ message: "Username already taken" });
      }
    }
    
    const updateData = {};
    if (name) updateData.name = name.trim();
    if (username) updateData.username = username.toLowerCase().trim();
    if (bio !== undefined) updateData.bio = bio.trim();
    
    const user = await User.findByIdAndUpdate(
      userId,
      updateData,
      { new: true, runValidators: true }
    ).select('-password -googleId');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: {
        id: user._id,
        username: user.username,
        name: user.name,
        email: user.email,
        picture: user.picture,
        bio: user.bio || '',
      }
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};

// Upload profile image
export const uploadProfileImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete old image from Cloudinary if exists
    if (user.profileImagePublicId) {
      await deleteFromCloudinary(user.profileImagePublicId);
    }
    
    // Upload new image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'cpcoders-profiles');
    
    // Update user with new image URL
    user.picture = result.secure_url;
    user.profileImagePublicId = result.public_id;
    await user.save();
    
    res.status(200).json({
      success: true,
      message: "Profile image updated successfully",
      picture: result.secure_url,
    });
  } catch (error) {
    console.error("Upload image error:", error);
    res.status(500).json({ message: "Image upload failed", error: error.message });
  }
};

// Get user by username (public profile)
export const getUserByUsername = async (req, res) => {
  try {
    const { username } = req.params;
    
    const user = await User.findOne({ username: username.toLowerCase() })
      .select('username name picture bio createdAt');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    res.status(200).json({
      success: true,
      user,
    });
  } catch (error) {
    console.error("Get user error:", error);
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
