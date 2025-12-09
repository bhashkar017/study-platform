const router = require('express').Router();
const verifyToken = require('../middleware/auth.middleware');
const multer = require('multer');
const path = require('path');
const File = require('../models/File');

// Configure storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/');
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage });

// Upload File
router.post('/upload', verifyToken, upload.single('file'), async (req, res) => {
    try {
        if (!req.file) return res.status(400).json({ message: 'No file uploaded' });
        const { groupId } = req.body;

        // URL to access the file
        const fileUrl = `${req.protocol}://${req.get('host')}/uploads/${req.file.filename}`;

        // Return ephemeral if no groupId (deprecated behavior) or save if groupId
        if (groupId) {
            const newFile = new File({
                filename: req.file.filename,
                originalName: req.file.originalname,
                path: fileUrl,
                uploader: req.user._id,
                group: groupId
            });
            const savedFile = await newFile.save();
            return res.json(savedFile);
        }

        // Fallback for non-group uploads (if any)
        res.json({
            filename: req.file.filename,
            path: fileUrl,
            originalName: req.file.originalname
        });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Files for Group
router.get('/group/:groupId', verifyToken, async (req, res) => {
    try {
        const files = await File.find({ group: req.params.groupId })
            .populate('uploader', 'username')
            .sort({ createdAt: -1 });
        res.json(files);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
