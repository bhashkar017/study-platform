const router = require('express').Router();
const Post = require('../models/Post');
const User = require('../models/User'); // Added User model import
const verifyToken = require('../middleware/auth.middleware');

// Create Post
// Create a Post
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, content, groupId, poll } = req.body;

        let newPost = new Post({
            title,
            content,
            group: groupId,
            author: req.user._id || req.user.id,
            comments: []
        });

        if (poll && poll.options && poll.options.length >= 2) {
            newPost.poll = poll;
        }

        const savedPost = await newPost.save();

        // Populate author for frontend immediately
        const populatedPost = await Post.findById(savedPost._id).populate('author', 'username profilePicture');

        // Gamification: +5 Reputation for creating a post
        await User.findByIdAndUpdate(req.user._id || req.user.id, { $inc: { reputation: 5 } });

        // Real-time: Emit event to group room
        const io = req.app.get('io');
        if (io) {
            io.to(groupId).emit('new_post', populatedPost);
        }

        res.status(201).json(populatedPost);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Posts for Group
router.get('/group/:groupId', verifyToken, async (req, res) => {
    try {
        const posts = await Post.find({ group: req.params.groupId })
            .populate('author', 'username profilePicture')
            .populate('comments.author', 'username profilePicture')
            .sort({ createdAt: -1 });
        res.json(posts);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a Comment
router.post('/:id/comment', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);
        post.comments.push({
            content,
            author: req.user._id
        });
        await post.save();

        // Gamification: +2 Reputation for commenting
        console.log(`[DEBUG] Incrementing reputation for user ${req.user._id}...`);
        const updatedUser = await User.findByIdAndUpdate(req.user._id || req.user.id, { $inc: { reputation: 2 } }, { new: true });
        console.log(`[DEBUG] Reputation updated. New Score: ${updatedUser ? updatedUser.reputation : 'User not found'}`);

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Post
router.delete('/:id', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        // Allow deletion if user is author OR if user is group admin
        // Finding group to check admin status involves extra query if needed, 
        // but typically "Author can delete" is the base requirement.
        // For simplicity: Author only.
        if (post.author.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this post' });
        }

        await post.deleteOne();

        // Gamification: -5 Reputation for deleting a post
        console.log(`[DEBUG] Decrementing reputation for user ${req.user._id}...`);
        await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: -5 } });

        res.json({ message: 'Post deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Vote on Poll
router.post('/:id/vote', verifyToken, async (req, res) => {
    try {
        const { optionIndex } = req.body;
        const post = await Post.findById(req.params.id);

        if (!post || !post.poll) return res.status(404).json({ message: 'Poll not found' });

        // Remove existing vote from this user in any option
        post.poll.options.forEach(opt => {
            opt.votes = opt.votes.filter(v => v.toString() !== req.user._id);
        });

        // Add new vote
        if (post.poll.options[optionIndex]) {
            post.poll.options[optionIndex].votes.push(req.user._id);
        }

        await post.save();
        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Comment
router.delete('/:id/comment/:commentId', verifyToken, async (req, res) => {
    try {
        const post = await Post.findById(req.params.id);
        if (!post) return res.status(404).json({ message: 'Post not found' });

        const comment = post.comments.id(req.params.commentId);
        if (!comment) return res.status(404).json({ message: 'Comment not found' });

        if (comment.author.toString() !== req.user._id) {
            return res.status(403).json({ message: 'Not authorized to delete this comment' });
        }

        comment.deleteOne(); // Remove subdocument
        await post.save();

        // Gamification: -2 Reputation for deleting a comment
        console.log(`[DEBUG] Decrementing reputation for user ${req.user._id} (comment deleted)...`);
        await User.findByIdAndUpdate(req.user._id, { $inc: { reputation: -2 } });

        res.json(post);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
