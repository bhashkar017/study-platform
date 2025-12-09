const mongoose = require('mongoose');

const CardSchema = new mongoose.Schema({
    deck: { type: mongoose.Schema.Types.ObjectId, ref: 'Deck', required: true },
    front: { type: String, required: true },
    back: { type: String, required: true },
    createdAt: { type: Date, default: Date.now }
});

const DeckSchema = new mongoose.Schema({
    title: { type: String, required: true },
    description: { type: String },
    group: { type: mongoose.Schema.Types.ObjectId, ref: 'Group', required: true },
    creator: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
    cards: [{ type: mongoose.Schema.Types.ObjectId, ref: 'Card' }],
    createdAt: { type: Date, default: Date.now }
});

module.exports = {
    Deck: mongoose.model('Deck', DeckSchema),
    Card: mongoose.model('Card', CardSchema)
};
