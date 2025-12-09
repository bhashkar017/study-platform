const router = require('express').Router();
const Group = require('../models/Group');
const verifyToken = require('../middleware/auth.middleware');

// Create Group
router.post('/', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const newGroup = new Group({
            name,
            description,
            createdBy: req.user._id,
            members: [req.user._id]
        });
        const savedGroup = await newGroup.save();
        res.status(201).json(savedGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get All Groups (or user's groups)
router.get('/', verifyToken, async (req, res) => {
    try {
        // Return all groups for discovery + groups user is part of
        const allGroups = await Group.find().populate('members', 'username name profilePicture reputation');
        res.json(allGroups);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Join Group
router.post('/:id/join', verifyToken, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);
        if (!group) return res.status(404).json({ message: 'Group not found' });

        if (!group.members.includes(req.user._id)) {
            group.members.push(req.user._id);
            await group.save();
        }
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Single Group
router.get('/:id', verifyToken, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id).populate('members', 'username name profilePicture reputation');
        res.json(group);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Update Group
router.put('/:id', verifyToken, async (req, res) => {
    try {
        const { name, description } = req.body;
        const group = await Group.findById(req.params.id);

        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (group.createdBy.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to edit this group' });
        }

        group.name = name || group.name;
        group.description = description || group.description;
        const updatedGroup = await group.save();
        res.json(updatedGroup);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Group
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const group = await Group.findById(req.params.id);

        if (!group) return res.status(404).json({ message: 'Group not found' });
        if (group.createdBy.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this group' });
        }

        await group.deleteOne(); // or findByIdAndDelete
        res.json({ message: 'Group deleted successfully' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
