const router = require('express').Router();
const Event = require('../models/Event');
const verifyToken = require('../middleware/auth.middleware');

// Create Event
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, description, start, end, groupId } = req.body;

        const newEvent = new Event({
            title,
            description,
            start,
            end,
            group: groupId,
            creator: req.user._id || req.user.id
        });

        const savedEvent = await newEvent.save();
        res.status(201).json(savedEvent);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Groups Events
router.get('/group/:groupId', verifyToken, async (req, res) => {
    try {
        const events = await Event.find({ group: req.params.groupId }).sort({ start: 1 });
        res.json(events);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Event
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const event = await Event.findById(req.params.id);
        if (!event) return res.status(404).json({ message: 'Event not found' });

        if (event.creator.toString() !== (req.user._id || req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Event.findByIdAndDelete(req.params.id);
        res.json({ message: 'Event deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
