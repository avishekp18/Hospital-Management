import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// Generate JWT token
const generateToken = (user) => {
  return jwt.sign({ id: user._id, role: user.role }, process.env.JWT_SECRET, {
    expiresIn: '1d', // Token expires in 1 day
  });
};

// User Registration
export const signup = async (req, res) => {
  try {
    const { username, email, password } = req.body; // Match frontend formData

    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user (password will be hashed by pre-save hook)
    const newUser = new User({
      username, // Use 'username' to match frontend
      email,
      password, // Plaintext password; hashed by User.js pre-save
      role: 'patient', // Default role for security
    });
    await newUser.save();

    // Generate token and respond with user data
    const token = generateToken(newUser);
    res.status(201).json({
      token,
      user: { _id: newUser._id, username: newUser.username, email: newUser.email, role: newUser.role },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// User Login
export const login = async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Compare password using model's method
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    // Generate JWT token
    const token = generateToken(user);
    res.json({
      token,
      user: { _id: user._id, username: user.username, email: user.email, role: user.role },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Server error' });
  }
};

// Logout (handled on frontend)
export const logout = (req, res) => {
  res.json({ message: 'Logged out successfully' });
};