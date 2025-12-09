const router = require('express').Router();
const { Deck, Card } = require('../models/Flashcard');
const verifyToken = require('../middleware/auth.middleware');
const User = require('../models/User');

// Create a Deck
router.post('/deck', verifyToken, async (req, res) => {
    try {
        const { title, description, groupId } = req.body;
        const newDeck = new Deck({
            title,
            description,
            group: groupId,
            creator: req.user._id || req.user.id
        });
        const savedDeck = await newDeck.save();
        res.status(201).json(savedDeck);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Add a Card to Deck
router.post('/card', verifyToken, async (req, res) => {
    try {
        const { front, back, deckId } = req.body;
        const newCard = new Card({
            front,
            back,
            deck: deckId
        });
        const savedCard = await newCard.save();

        // Add to deck's card list
        await Deck.findByIdAndUpdate(deckId, { $push: { cards: savedCard._id } });

        // Gamification: +1 Point for adding a card (small reward)
        await User.findByIdAndUpdate(req.user._id || req.user.id, { $inc: { reputation: 1 } });

        res.status(201).json(savedCard);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Get Decks for a Group
router.get('/group/:groupId', verifyToken, async (req, res) => {
    try {
        const decks = await Deck.find({ group: req.params.groupId })
            .populate('creator', 'username')
            .populate('cards')
            .sort({ createdAt: -1 });
        res.json(decks);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// Delete Deck
router.delete('/deck/:deckId', verifyToken, async (req, res) => {
    try {
        const deck = await Deck.findById(req.params.deckId);
        if (!deck) return res.status(404).json({ message: 'Deck not found' });

        // Ownership check
        if (deck.creator.toString() !== (req.user._id || req.user.id)) {
            return res.status(403).json({ message: 'Not authorized' });
        }

        await Card.deleteMany({ deck: req.params.deckId });
        await Deck.findByIdAndDelete(req.params.deckId);
        res.json({ message: 'Deck deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
