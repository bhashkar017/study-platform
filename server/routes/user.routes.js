const router = require('express').Router();
const User = require('../models/User');
const verifyToken = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');

// Configure Multer Storage for Profile Pictures
const storage = multer.diskStorage({
    destination: './uploads/',
    filename: (req, file, cb) => {
        cb(null, 'profile-' + Date.now() + path.extname(file.originalname));
    }
});
const upload = multer({ storage });

// Upload Profile Picture
router.post('/profile/upload', verifyToken, upload.single('profilePicture'), async (req, res) => {
    try {
        console.log("=== Profile Upload Start ===");
        console.log("Req User from Token:", req.user);

        if (!req.file) {
            console.log("Error: No file in request");
            return res.status(400).json({ message: 'No file uploaded' });
        }
        console.log("File received:", req.file.filename);

        const userId = req.user._id || req.user.id;
        console.log("Using User ID:", userId);

        const user = await User.findById(userId);

        if (!user) {
            console.log("Error: User not found in DB for ID:", userId);
            return res.status(404).json({ message: 'User not found' });
        }

        // Construct URL
        const fileUrl = `http://localhost:5000/uploads/${req.file.filename}`;
        console.log("File URL generated:", fileUrl);

        user.profilePicture = fileUrl;
        await user.save();
        console.log("User updated successfully");

        res.json({ profilePicture: fileUrl, user });
    } catch (err) {
        console.error("Upload Route Exception:", err);
        res.status(500).json({ error: err.message });
    }
});

// Update Profile Details (Name)
router.put('/profile', verifyToken, async (req, res) => {
    try {
        const { name } = req.body;
        const userId = req.user._id || req.user.id;

        const user = await User.findById(userId);
        if (!user) return res.status(404).json({ message: 'User not found' });

        if (name) user.name = name;
        await user.save();

        res.json(user);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
