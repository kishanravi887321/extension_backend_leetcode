import User from "../models/User.models.js";
import Auth from "../utils/authTokens.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    const payload = ticket.getPayload();
    const { sub: googleId, email, name, picture } = payload;
    
    // Check if user exists
    let user = await User.findOne({ email: email.toLowerCase() });
    
    if (!user) {
      // Create new user
      user = new User({
        googleId,
        email: email.toLowerCase().trim(),
        name: name.trim(),
        username: email.split('@')[0],
        picture,
      });
      await user.save();
    } else {
      // Update googleId and picture if not set
      if (!user.googleId) {
        user.googleId = googleId;
        user.picture = picture;
        await user.save();
      }
    }
    
    res.status(200).json({
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
      }
    });
  } catch (error) {
    console.error("Google login error:", error);
    res.status(500).json({ message: "Authentication failed", error: error.message });
  }
};

export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email=email.toLowerCase().trim();
    password=password.trim();
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    const isMatch = await user.matchPassword(password);
    if (!isMatch) {
      return res.status(400).json({ message: "Invalid email or password" });
    }
    res.status(200).json({ message: "Login successful" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};  
