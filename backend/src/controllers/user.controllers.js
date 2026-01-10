import User from "../models/User.models.js";

export const registerUser = async (req, res) => {
  try {
    let { username, name, email, password } = req.body;
    console.log(req.body);
    const existingUser = await User.findOne({ $or: [{ username }, { email }] });
    if (existingUser) {
      return res.status(400).json({ message: "Username or Email already exists" });
    }
    email=email.toLowerCase();
    const newUser = new User({ username, name, email, password });
    console.log("pass")
    await newUser.save();
     console.log("pass")
    res.status(201).json({ message: "User registered successfully" });
  } catch (error) {
    res.status(500).json({ message: "Server error", error: error.message });
  }
};
export const loginUser = async (req, res) => {
  try {
    let { email, password } = req.body;
    email=email.toLowerCase();
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
