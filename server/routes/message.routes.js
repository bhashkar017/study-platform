const router = require('express').Router();
const Message = require('../models/Message');
const User = require('../models/User');
const verifyToken = require('../middleware/auth.middleware');

// Send a Message
router.post('/', verifyToken, async (req, res) => {
    try {
        const { recipientId, content } = req.body;

        if (!recipientId || !content) {
            return res.status(400).json({ message: 'Recipient and content are required' });
        }

        const newMessage = new Message({
            sender: req.user._id,
            recipient: recipientId,
            content
        });

        const savedMessage = await newMessage.save();

        // Populate details for real-time emission
        const populatedMessage = await Message.findById(savedMessage._id)
            .populate('sender', 'username profilePicture name')
            .populate('recipient', 'username profilePicture name');

        // Socket.io: Emit to recipient's personal room
        const io = req.app.get('io');
        if (io) {
            io.to(recipientId).emit('private_message', populatedMessage);
        }

        res.status(201).json(populatedMessage);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Conversation with specific user
router.get('/:userId', verifyToken, async (req, res) => {
    try {
        const { userId } = req.params;
        const currentUserId = req.user._id;

        const messages = await Message.find({
            $or: [
                { sender: currentUserId, recipient: userId },
                { sender: userId, recipient: currentUserId }
            ]
        })
            .sort({ createdAt: 1 })
            .populate('sender', 'username profilePicture name')
            .populate('recipient', 'username profilePicture name');

        res.json(messages);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get List of Conversations (Recent Chats)
router.get('/conversations/all', verifyToken, async (req, res) => {
    try {
        const currentUserId = req.user._id;

        // Aggregate to find unique users interacted with
        // This is a simplified approach. For production, a separate Conversation model is efficient.
        // Here we find all messages where user is sender or recipient
        const messages = await Message.find({
            $or: [{ sender: currentUserId }, { recipient: currentUserId }]
        })
            .sort({ createdAt: -1 })
            .populate('sender', 'username profilePicture name')
            .populate('recipient', 'username profilePicture name');

        const conversations = [];
        const seenUsers = new Set();

        messages.forEach(msg => {
            const isSender = msg.sender._id.toString() === currentUserId;
            const otherUser = isSender ? msg.recipient : msg.sender;

            if (!seenUsers.has(otherUser._id.toString())) {
                seenUsers.add(otherUser._id.toString());
                conversations.push({
                    user: otherUser,
                    lastMessage: msg
                });
            }
        });

        res.json(conversations);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
