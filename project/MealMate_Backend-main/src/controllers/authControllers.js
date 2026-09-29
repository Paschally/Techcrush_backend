import jwt from "jsonwebtoken"
import asyncHandler from "../utils/asyncHandler.js"
import AppError from "../utils/errorHandler.js"
import User from "../models/user.js"


/*
const generatToken = (id) => {
  return jwt.sign({id}, process.env.JWT_SECRET,{
    expiresIn: process.env.JWT_SECRET
  })
} */

const generateToken = (id) => {
  return jwt.sign({ id }, process.env.JWT_SECRET, {
    expiresIn: process.env.JWT_EXPIRE
  });
};

// @desc Register - Screen 12.2 Create Account
export const register = asyncHandler(async (req, res, next) => {
  const { name, email, password, phone, role } = req.body;

  if (role === "admin"){
    return next(new AppError("You cannot perform this action"))
  }

  const userExists = await User.findOne({ email });
  if (userExists) throw new AppError('User already exists', 400);

  const user = await User.create({ name, email, password, phone, role });

  res.status(201).json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

// Login
export const login = asyncHandler(async (req, res, next) => {
  const { email, password } = req.body;

  const user = await User.findOne({ email });
  if (!user) throw new AppError('Invalid credentials', 401);

  const isMatch = await user.matchPassword(password);
  if (!isMatch) throw new AppError('Invalid credentials', 401);

  res.json({
    success: true,
    data: {
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      token: generateToken(user._id)
    }
  });
});

// getMe
export const getMe = asyncHandler(async (req, res) => {
  res.json({ success: true, data: req.user });
});