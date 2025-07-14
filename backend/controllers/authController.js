// backend/controllers/authController.js
import User from "../models/User.js";
import jwt from "jsonwebtoken";
import bcrypt from "bcryptjs";

const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

export const register = async (req, res) => {
  const { name, email, password } = req.body;
  try {
    const exists = await User.findOne({ email });
    if (exists) return res.status(400).json({ msg: "User already exists" });

    const user = await User.create({ name, email, password });
    const token = generateToken(user._id);
    res.status(201).json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Registration failed", error: err.message });
  }
};

export const login = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ msg: "Invalid credentials" });

    const match = await bcrypt.compare(password, user.password);
    if (!match) return res.status(400).json({ msg: "Invalid credentials" });

    const token = generateToken(user._id);
    res.json({ token, user: { name: user.name, email: user.email } });
  } catch (err) {
    res.status(500).json({ msg: "Login failed", error: err.message });
  }
};
