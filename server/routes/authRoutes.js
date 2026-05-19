import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User.js';
import { protect } from '../middleware/authMiddleware.js';

const router = express.Router();

// Signup Route
router.post('/signup', async (req, res) => {
  try {
    const { name, username, email, password } = req.body;

    // Check if user already exists
    const existingUserByEmail = await User.findOne({ email });
    if (existingUserByEmail) {
      return res.status(400).json({ field: 'email', message: 'USER IS ALREADY REGISTERED' });
    }

    const existingUserByUsername = await User.findOne({ username });
    if (existingUserByUsername) {
      return res.status(400).json({ field: 'username', message: 'Username is already taken' });
    }

    // Hash password
    const salt = await bcrypt.genSalt(10);
    const hashedPassword = await bcrypt.hash(password, salt);

    // Create new user
    const newUser = new User({
      name,
      username,
      email: email.toLowerCase(),
      password: hashedPassword,
    });

    await newUser.save();

    // Create token
    const token = jwt.sign(
      { id: newUser._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.status(201).json({
      success: true,
      token,
      user: {
        id: newUser._id,
        name: newUser.name,
        username: newUser.username,
        email: newUser.email,
        avatar: newUser.avatar,
        bookmarks: newUser.bookmarks,
      },
    });
  } catch (error) {
    console.error('Signup error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Login Route
router.post('/login', async (req, res) => {
  try {
    const { email, password } = req.body;

    // Find user by email or username
    const user = await User.findOne({
      $or: [{ email: email.toLowerCase() }, { username: email }],
    });

    if (!user) {
      return res.status(400).json({ field: 'email', message: 'Invalid credentials' });
    }

    // Check password
    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
      return res.status(400).json({ field: 'password', message: 'Invalid credentials' });
    }

    // Create token
    const token = jwt.sign(
      { id: user._id },
      process.env.JWT_SECRET || 'fallback_secret',
      { expiresIn: '1d' }
    );

    res.status(200).json({
      success: true,
      token,
      user: {
        id: user._id,
        name: user.name,
        username: user.username,
        email: user.email,
        avatar: user.avatar,
        bookmarks: user.bookmarks,
      },
    });
  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({ message: 'Internal server error' });
  }
});

// Get Current User
router.get('/me', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).select('-password');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Update Profile
router.put('/update', protect, async (req, res) => {
  try {
    const { name, username, email, avatar, password } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    // Check if new email/username is already taken by someone else
    if (email && email !== user.email) {
      const emailExists = await User.findOne({ email: email.toLowerCase() });
      if (emailExists) return res.status(400).json({ field: 'email', message: 'Email already taken' });
      user.email = email.toLowerCase();
    }

    if (username && username !== user.username) {
      const usernameExists = await User.findOne({ username });
      if (usernameExists) return res.status(400).json({ field: 'username', message: 'Username already taken' });
      user.username = username;
    }

    if (name) user.name = name;
    if (avatar) user.avatar = avatar;

    if (password) {
      const salt = await bcrypt.genSalt(10);
      user.password = await bcrypt.hash(password, salt);
    }

    const updatedUser = await user.save();

    res.json({
      success: true,
      user: {
        id: updatedUser._id,
        name: updatedUser.name,
        username: updatedUser.username,
        email: updatedUser.email,
        avatar: updatedUser.avatar,
        bookmarks: updatedUser.bookmarks,
      },
    });
  } catch (error) {
    console.error('Update error:', error);
    res.status(500).json({ message: 'Server error' });
  }
});

// Toggle Bookmark
router.post('/toggle-bookmark', protect, async (req, res) => {
  try {
    const { propertyId } = req.body;
    const user = await User.findById(req.userId);

    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }

    const index = user.bookmarks.indexOf(propertyId);
    if (index > -1) {
      // Remove if exists
      user.bookmarks.splice(index, 1);
    } else {
      // Add if doesn't exist
      user.bookmarks.push(propertyId);
    }

    await user.save();
    res.json({ success: true, bookmarks: user.bookmarks });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Get Saved Properties
router.get('/bookmarks', protect, async (req, res) => {
  try {
    const user = await User.findById(req.userId).populate('bookmarks');
    if (!user) {
      return res.status(404).json({ message: 'User not found' });
    }
    res.json(user.bookmarks);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

export default router;
