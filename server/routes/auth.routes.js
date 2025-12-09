const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

// Register
router.post('/register', async (req, res) => {
    try {
        const { name, username, email, password } = req.body;

        // Check if user exists
        const userExists = await User.findOne({ email });
        if (userExists) return res.status(400).json({ message: 'Email already exists' });

        // Hash password
        const salt = await bcrypt.genSalt(10);
        const hashedPassword = await bcrypt.hash(password, salt);

        // Create user
        const newUser = new User({
            name,
            username,
            email,
            password: hashedPassword
        });
        const savedUser = await newUser.save();

        const token = jwt.sign({ _id: savedUser._id }, process.env.JWT_SECRET);
        res.status(201).json({ token, user: { id: savedUser._id, name: savedUser.name, username: savedUser.username, email: savedUser.email, profilePicture: savedUser.profilePicture } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Login
router.post('/login', async (req, res) => {
    try {
        const { email, password } = req.body;

        // Check user
        const user = await User.findOne({ email });
        if (!user) return res.status(400).json({ message: 'Invalid credentials' });

        // Check password
        const validPass = await bcrypt.compare(password, user.password);
        if (!validPass) return res.status(400).json({ message: 'Invalid credentials' });

        // Create token
        const token = jwt.sign({ _id: user._id }, process.env.JWT_SECRET);
        res.json({ token, user: { id: user._id, name: user.name, username: user.username, email: user.email, profilePicture: user.profilePicture } });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
