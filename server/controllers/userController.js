import cloudinary from "../lib/cloudinary.js";
import { generateToken } from "../lib/utils.js";
import User from "../models/User.js";
import bcrypt from "bcryptjs";

export const signup = async (req, res) => {
  const { fullName, password, email, bio } = req.body;
  try {
    if (!fullName || !password || !email || !bio) {
      return res.json({ success: false, message: "Missing parameters" });
    }
    const existedUser = await User.findOne({ email });
    if (existedUser) {
      return res.json({ success: false, message: "User already exists" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    const newUser = await User.create({
      fullName,
      email,
      password: hashedPassword,
      bio,
    });

    const token = generateToken(newUser._id);

    res.json({
      success: true,
      userData: newUser,
      token,
      message: "Account created successfully",
    });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

export const login = async (req, res) => {
  try {
    const { email, password } = req.body;
    const userData = await User.findOne({ email });

    if (!userData) {
      return res.json({ success: false, message: "Email not found" });
    }

    const isPasswordCorrect = await bcrypt.compare(password, userData.password);
    if (!isPasswordCorrect) {
      return res.json({ success: false, message: "Incorrect password" });
    }

    const token = generateToken(userData._id);

    res.json({ success: true, userData, token, message: "Logged in successfully" });
  } catch (error) {
    res.json({ success: false, message: error.message });
  }
};

// Fixed: was returning success: false always
export const checkAuth = (req, res) => {
  res.json({ success: true, user: req.user });
};

// Update profile (name, bio, avatar)
export const updateProfile = async (req, res) => {
  try {
    const { profilePic, bio, fullName } = req.body;
    const userId = req.user._id;
    let updatedUser;
    if (!profilePic) {
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { bio, fullName },
        { new: true }
      );
    } else {
      const upload = await cloudinary.uploader.upload(profilePic);
      updatedUser = await User.findByIdAndUpdate(
        userId,
        { profilePic: upload.secure_url, bio, fullName },
        { new: true }
      );
    }
    res.json({ success: true, user: updatedUser });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};

// Change password
export const changePassword = async (req, res) => {
  try {
    const { currentPassword, newPassword } = req.body;
    const userId = req.user._id;

    if (!currentPassword || !newPassword) {
      return res.json({ success: false, message: "Both current and new password are required" });
    }

    if (newPassword.length < 6) {
      return res.json({ success: false, message: "New password must be at least 6 characters" });
    }

    const user = await User.findById(userId);
    const isMatch = await bcrypt.compare(currentPassword, user.password);
    if (!isMatch) {
      return res.json({ success: false, message: "Current password is incorrect" });
    }

    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(newPassword, salt);

    await User.findByIdAndUpdate(userId, { password: hashedPassword });

    res.json({ success: true, message: "Password changed successfully" });
  } catch (error) {
    console.log(error.message);
    res.json({ success: false, message: error.message });
  }
};
