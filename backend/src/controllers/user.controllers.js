import User from "../models/User.models.js";
import Auth from "../utils/authTokens.js";
import { OAuth2Client } from "google-auth-library";

const client = new OAuth2Client(process.env.GOOGLE_CLIENT_ID);

// Cookie configuration for production
const getCookieOptions = (maxAge) => ({
  httpOnly: true,
  secure: process.env.NODE_ENV === 'production',
  sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
  maxAge: maxAge,
  path: '/'
});

// Set auth cookies helper
const setAuthCookies = (res, accessToken, refreshToken) => {
  // Access token expires in 15 minutes
  res.cookie('accessToken', accessToken, getCookieOptions(15 * 60 * 1000));
  // Refresh token expires in 7 days
  res.cookie('refreshToken', refreshToken, getCookieOptions(7 * 24 * 60 * 60 * 1000));
};

// Clear auth cookies helper
const clearAuthCookies = (res) => {
  res.clearCookie('accessToken', { path: '/' });
  res.clearCookie('refreshToken', { path: '/' });
};

export const googleLogin = async (req, res) => {
  try {
    const { credential } = req.body;
    console.log("Received credential:", credential);
    // Verify Google token
    const ticket = await client.verifyIdToken({
      idToken: credential,
      audience: process.env.GOOGLE_CLIENT_ID,
    });
    
    console.log("Google ticket:", ticket);
    
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

    const accessToken = Auth.generateAccessToken(user);
    // console.log("Generated Access Token:", accessToken);
    const refreshToken = Auth.generateRefreshToken(user);
    // console.log("Generated Refresh Token:", refreshToken);
    const extensionToken = Auth.generateExtensionToken(user);

    // Set HTTP-only cookies for web authentication
    setAuthCookies(res, accessToken, refreshToken);

    res.status(200).json({
      success: true,
      message: "Login successful",
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        picture: user.picture,
        username: user.username,
        bio: user.bio,
      },
      // Only send extensionToken in response body (for browser extension/localStorage)
      extensionToken
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

// Refresh Token endpoint
export const refreshToken = async (req, res) => {
  try {
    // Get refresh token from cookie or body (for backward compatibility)
    const refreshTokenValue = req.cookies?.refreshToken || req.body?.refreshToken;
    
    if (!refreshTokenValue) {
      return res.status(401).json({ success: false, message: "Refresh token required" });
    }

    // Verify the refresh token
    const decoded = Auth.verifyRefreshToken(refreshTokenValue);
    
    // Find user
    const user = await User.findById(decoded.id);
    if (!user) {
      return res.status(401).json({ success: false, message: "User not found" });
    }

    // Generate new access token
    const newAccessToken = Auth.generateAccessToken(user);
    const newRefreshToken = Auth.generateRefreshToken(user);

    // Set new cookies
    setAuthCookies(res, newAccessToken, newRefreshToken);

    res.status(200).json({
      success: true,
      message: "Token refreshed successfully"
    });
  } catch (error) {
    console.error("Refresh token error:", error);
    clearAuthCookies(res);
    res.status(401).json({ success: false, message: "Invalid or expired refresh token" });
  }
};

// Logout endpoint - clears cookies
export const logout = async (req, res) => {
  try {
    clearAuthCookies(res);
    res.status(200).json({
      success: true,
      message: "Logged out successfully"
    });
  } catch (error) {
    console.error("Logout error:", error);
    res.status(500).json({ success: false, message: "Error during logout" });
  }
};
