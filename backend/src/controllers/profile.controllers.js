import User from "../models/User.models.js";
import { uploadToCloudinary, deleteFromCloudinary } from "../utils/cloudinary.js";
import { cacheGet, cacheSet } from "../db/redis.db.js";

const parseCacheTtlSeconds = (value, fallback) => {
  const parsed = Number.parseInt(value, 10);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : fallback;
};

const PROFILE_CACHE_TTL_SECONDS = parseCacheTtlSeconds(
  process.env.REDIS_CACHE_TTL_SECONDS,
  1800
);

const getProfileCacheKey = (userId) => `profile:${userId}`;

const buildProfilePayload = (user) => ({
  id: user._id,
  username: user.username,
  name: user.name,
  email: user.email,
  picture: user.picture,
  coverImage: user.coverImage || "",
  bio: user.bio || "",
  twoFactorEnabled: user.twoFactorEnabled,
  createdAt: user.createdAt,
});

// Get current user's profile
export const getProfile = async (req, res) => {
  try {
    const cacheKey = getProfileCacheKey(req.user.id);
    const cachedProfile = await cacheGet(cacheKey, PROFILE_CACHE_TTL_SECONDS);
    if (cachedProfile) {
      return res.status(200).json({
        success: true,
        user: cachedProfile
      });
    }

    const user = await User.findById(req.user.id).select('-password -googleId');
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    const profilePayload = buildProfilePayload(user);
    await cacheSet(cacheKey, profilePayload, PROFILE_CACHE_TTL_SECONDS);
    
    res.status(200).json({
      success: true,
      user: profilePayload
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

    const profilePayload = buildProfilePayload(user);
    await cacheSet(
      getProfileCacheKey(userId),
      profilePayload,
      PROFILE_CACHE_TTL_SECONDS
    );
    
    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      user: profilePayload
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

    const profilePayload = buildProfilePayload(user);
    await cacheSet(
      getProfileCacheKey(userId),
      profilePayload,
      PROFILE_CACHE_TTL_SECONDS
    );
    
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

// Upload cover image
export const uploadCoverImage = async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ message: "No image file provided" });
    }
    
    const userId = req.user.id;
    const user = await User.findById(userId);
    
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }
    
    // Delete old cover image from Cloudinary if exists
    if (user.coverImagePublicId) {
      await deleteFromCloudinary(user.coverImagePublicId);
    }
    
    // Upload new cover image to Cloudinary
    const result = await uploadToCloudinary(req.file.buffer, 'cpcoders-covers');
    
    // Update user with new cover image URL
    user.coverImage = result.secure_url;
    user.coverImagePublicId = result.public_id;
    await user.save();

    const profilePayload = buildProfilePayload(user);
    await cacheSet(
      getProfileCacheKey(userId),
      profilePayload,
      PROFILE_CACHE_TTL_SECONDS
    );
    
    res.status(200).json({
      success: true,
      message: "Cover image updated successfully",
      coverImage: result.secure_url,
    });
  } catch (error) {
    console.error("Upload cover image error:", error);
    res.status(500).json({ message: "Cover image upload failed", error: error.message });
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
