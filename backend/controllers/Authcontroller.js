import User from '../models/User.js';
import jwt from 'jsonwebtoken';

// JWT Token generate karna
const generateToken = (userId) => {
  return jwt.sign(
    { id: userId }, 
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '30d' }
  );
};

// @desc    Signup - Naya user register
// @route   POST /api/auth/signup
export const signup = async (req, res) => {
  try {
    console.log('📝 Signup request received:', req.body);
    
    const { name, email, password } = req.body;

    // Validation
    if (!name || !email || !password) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Name, email aur password required hain'
      });
    }

    console.log('🔍 Checking if email exists:', email);
    
    // Check email already exists
    const existingUser = await User.findOne({ email });
    
    console.log('📊 Existing user found:', existingUser ? 'Yes' : 'No');
    
    if (existingUser) {
      console.log('❌ Email already exists in database');
      return res.status(400).json({
        success: false,
        message: 'Email already registered hai'
      });
    }

    console.log('✅ Creating new user...');
    
    // Create new user
    const user = await User.create({
      name,
      email,
      password
    });

    console.log('✅ User created successfully:', user._id);

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Token generated, sending response');

    res.status(201).json({
      success: true,
      message: 'User successfully registered',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('❌❌❌ Signup Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    // Handle duplicate key error specifically
    if (error.code === 11000) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered hai (duplicate key error)'
      });
    }
    
    res.status(500).json({
      success: false,
      message: 'Signup mein error aaya',
      error: error.message
    });
  }
};

// @desc    Login
// @route   POST /api/auth/login
export const login = async (req, res) => {
  try {
    console.log('🔐 Login request received:', req.body);
    
    const { email, password } = req.body;

    // Validation
    if (!email || !password) {
      console.log('❌ Validation failed - missing fields');
      return res.status(400).json({
        success: false,
        message: 'Email aur password required hain'
      });
    }

    console.log('🔍 Finding user:', email);

    // Find user
    const user = await User.findOne({ email });
    
    console.log('📊 User found:', user ? 'Yes' : 'No');
    
    if (!user) {
      console.log('❌ User not found in database');
      return res.status(401).json({
        success: false,
        message: 'Invalid email ya password'
      });
    }

    console.log('🔒 Comparing password...');

    // Check password
    const isPasswordMatch = await user.comparePassword(password);
    
    console.log('📊 Password match:', isPasswordMatch ? 'Yes' : 'No');
    
    if (!isPasswordMatch) {
      console.log('❌ Password mismatch');
      return res.status(401).json({
        success: false,
        message: 'Invalid email ya password'
      });
    }

    console.log('✅ Password matched, generating token...');

    // Generate token
    const token = generateToken(user._id);

    console.log('✅ Login successful, sending response');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          _id: user._id,
          name: user.name,
          email: user.email
        },
        token
      }
    });

  } catch (error) {
    console.error('❌❌❌ Login Error:', error);
    console.error('Error name:', error.name);
    console.error('Error message:', error.message);
    console.error('Error stack:', error.stack);
    
    res.status(500).json({
      success: false,
      message: 'Login mein error aaya',
      error: error.message
    });
  }
};