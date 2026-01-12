const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Secret key should be in .env, but for now using a fallback
const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

// Register
router.post('/register', async (req, res) => {
    try {
        const { username, password, role } = req.body;

        // Check availability
        const existingUser = await User.findOne({ username });
        if (existingUser) return res.status(400).json({ message: 'Username already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            username,
            password: hashedPassword,
            role: role || 'user'
        });

        const savedUser = await newUser.save();
        res.status(201).json({ userId: savedUser._id, username: savedUser.username });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { username, password } = req.body;

        // Check user
        const user = await User.findOne({ username });
        if (!user) return res.status(400).json({ message: 'User not found' });

        // Check password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid password' });

        // Create token
        const token = jwt.sign({ _id: user._id, username: user.username }, JWT_SECRET, { expiresIn: '1h' });

        res.header('auth-token', token).json({ token, userId: user._id, username: user.username, role: user.role });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
