const User = require('../models/User');
const jwt = require('jsonwebtoken');

// Register a new user
exports.registerUser = async (req, res) => {
  const { firstName, lastName, email, password } = req.body;

  try {
    let user = await User.findOne({ email });
    if (user) {
      return res.status(400).json({ msg: 'User already exists' });
    }

    const baseUsername = `${firstName.toLowerCase()}.${lastName.toLowerCase()}`;
    let finalUsername = baseUsername;
    let counter = 1;

    while (await User.findOne({ username: finalUsername })) {
      finalUsername = `${baseUsername}${counter}`;
      counter++;
    }

    user = new User({ username: finalUsername, email, password });
    await user.save();

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ msg: 'Token generation failed' });
      }
      res.status(201).json({ token, username: finalUsername });
    });
  } catch (err) {
    console.error('Error in registerUser:', err);
    res.status(500).json({ msg: 'Server error in registration' });
  }
};

// Login existing user
exports.loginUser = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.findOne({ email });
    if (!user || !(await user.comparePassword(password))) {
      return res.status(400).json({ msg: 'Invalid credentials' });
    }

    const payload = { user: { id: user.id } };
    jwt.sign(payload, process.env.JWT_SECRET, { expiresIn: '1h' }, (err, token) => {
      if (err) {
        console.error('JWT signing error:', err);
        return res.status(500).json({ msg: 'Token generation failed' });
      }

      res.json({
        token,
        username: user.username,
        userId: user._id,
        email: user.email,
      });
    });
  } catch (err) {
    console.error('Error in loginUser:', err);
    res.status(500).json({ msg: 'Server error in login' });
  }
};

// Get authenticated user profile
exports.getUser = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUser:', err);
    res.status(500).json({ msg: 'Server error fetching profile' });
  }
};

// Get user by ID (optional route)
exports.getUserById = async (req, res) => {
  try {
    const user = await User.findById(req.params.userId).select('-password');
    if (!user) {
      return res.status(404).json({ msg: 'User not found' });
    }
    res.json(user);
  } catch (err) {
    console.error('Error in getUserById:', err);
    res.status(500).json({ msg: 'Server error fetching user by ID' });
  }
};
