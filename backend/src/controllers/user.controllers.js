import User from "../models/User.models.js";
import Auth from "../utils/authTokens.js";


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
