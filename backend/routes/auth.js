const express = require('express');
const router = express.Router();
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const User = require('../models/User');
const { validateUser } = require('../middleware/validator');
const auth = require('../middleware/auth');

// @route   POST /api/auth/register
// @desc    Register a user
// @access  Public
router.post('/register', validateUser, async (req, res) => {
  try {
    const { name, email, password, role } = req.body;
    console.log('Registration attempt for:', email, 'with role:', role);

    // Validate role
    if (!['customer', 'shopkeeper'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ message: 'User already exists' });
    }

    // Create new user
    user = new User({
      name: name.trim(),
      email: email.trim().toLowerCase(),
      password: password.trim(),
      role
    });

    // Save user
    await user.save();
    console.log('User saved successfully:', user.email);

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Token generation error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        const userResponse = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        console.log('Registration successful for:', email, 'Role:', user.role);
        res.json({
          token,
          user: userResponse
        });
      }
    );
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   POST /api/auth/login
// @desc    Login user
// @access  Public
router.post('/login', async (req, res) => {
  try {
    const { email, password, role } = req.body;
    console.log('Login attempt for:', email, 'with role:', role);

    // Validate inputs
    if (!email || !password || !role) {
      return res.status(400).json({ message: 'All fields are required' });
    }

    // Validate role
    if (!['customer', 'shopkeeper'].includes(role)) {
      return res.status(400).json({ message: 'Invalid role' });
    }

    // Check if user exists
    const user = await User.findOne({ email: email.trim().toLowerCase() });
    if (!user) {
      console.log('User not found:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Check if role matches
    if (user.role !== role) {
      console.log('Role mismatch for:', email, 'Expected:', role, 'Got:', user.role);
      return res.status(400).json({ message: 'Invalid role for this account' });
    }

    // Check password
    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      console.log('Invalid password for:', email);
      return res.status(400).json({ message: 'Invalid credentials' });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Create JWT token
    const payload = {
      user: {
        id: user.id
      }
    };

    jwt.sign(
      payload,
      process.env.JWT_SECRET,
      { expiresIn: '24h' },
      (err, token) => {
        if (err) {
          console.error('Token generation error:', err);
          return res.status(500).json({ message: 'Server error' });
        }
        
        const userResponse = {
          _id: user._id,
          name: user.name,
          email: user.email,
          role: user.role
        };
        
        console.log('Login successful for:', email, 'Role:', user.role);
        res.json({
          token,
          user: userResponse
        });
      }
    );
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: error.message || 'Server error' });
  }
});

// @route   GET /api/auth/user
// @desc    Get user data
// @access  Private
router.get('/user', auth, async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    res.json(user);
  } catch (error) {
    console.error(error.message);
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;