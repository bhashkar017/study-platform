const router = require('express').Router();
const Post = require('../models/Post');
const verifyToken = require('../middleware/auth.middleware');

// Create Post
// Create Post
router.post('/', verifyToken, async (req, res) => {
    try {
        const { title, content, groupId, files, poll } = req.body;
        const newPost = new Post({
            title,
            content,
            group: groupId,
            author: req.user._id,
            files: files || [],
            poll: poll || undefined
        });
        const savedPost = await newPost.save();
        res.status(201).json(savedPost);
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

// Add Comment
router.post('/:id/comment', verifyToken, async (req, res) => {
    try {
        const { content } = req.body;
        const post = await Post.findById(req.params.id);
        post.comments.push({
            content,
            author: req.user._id
        });
        await post.save();
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

module.exports = router;
