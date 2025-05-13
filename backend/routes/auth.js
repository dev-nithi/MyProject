const express = require('express');
const router = express.Router();
const {
  registerUser,
  loginUser,
  getUser,
  getUserById,
} = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware');

// @route   POST /api/auth/register
// @desc    Register a new user
router.post('/register', registerUser);

// @route   POST /api/auth/login
// @desc    Login user and return JWT
router.post('/login', loginUser);

// @route   GET /api/auth/user
// @desc    Get current user profile using token
// @access  Private
router.get('/user', authMiddleware, getUser);

// @route   GET /api/auth/users/:userId
// @desc    Get user by ID (optional, for future use)
// @access  Public (can be protected if needed)
router.get('/users/:userId', getUserById);

module.exports = router;
