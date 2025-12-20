const router = require('express').Router();
const User = require('../models/User');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// Forgot Password (OTP Generation)
router.post('/forgot-password', async (req, res) => {
    try {
        const user = await User.findOne({ email: req.body.email });
        if (!user) return res.status(404).json({ message: 'User not found' });

        // Set Fixed Demo OTP
        const otp = "1234";

        // Hash and set to resetPasswordToken (Storing hash of "1234")
        user.resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');
        user.resetPasswordExpire = Date.now() + 10 * 60 * 1000; // 10 Minutes

        await user.save();

        console.log(`OTP generated for ${user.email}: ${otp}`);

        res.status(200).json({ success: true, data: 'OTP sent to email' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Verify OTP
router.post('/verify-otp', async (req, res) => {
    try {
        const { email, otp } = req.body;

        const resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid OTP' });

        res.status(200).json({ success: true, message: 'OTP verified' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Reset Password Final
router.post('/reset-password-final', async (req, res) => {
    try {
        const { email, otp, password } = req.body;

        const resetPasswordToken = crypto.createHash('sha256').update(otp).digest('hex');

        const user = await User.findOne({
            email,
            resetPasswordToken,
            resetPasswordExpire: { $gt: Date.now() }
        });

        if (!user) return res.status(400).json({ message: 'Invalid or expired session' });

        // Set new password
        const salt = await bcrypt.genSalt(10);
        user.password = await bcrypt.hash(password, salt);

        user.resetPasswordToken = undefined;
        user.resetPasswordExpire = undefined;

        await user.save();

        res.status(200).json({ success: true, data: 'Password updated success' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

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
        res.json({
            token,
            user: {
                id: user._id,
                name: user.name,
                username: user.username,
                email: user.email,
                profilePicture: user.profilePicture,
                reputation: user.reputation
            }
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Current User
const verifyToken = require('../middleware/auth.middleware');
router.get('/me', verifyToken, async (req, res) => {
    try {
        const user = await User.findById(req.user._id).select('-password');
        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
