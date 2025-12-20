const mongoose = require('mongoose');

const UserSchema = new mongoose.Schema({
    name: { type: String, required: false }, // Full Name (Optional for legacy support)
    username: { type: String, required: true, unique: true },
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    profilePicture: { type: String, default: '' }, // URL to image
    reputation: { type: Number, default: 0 },
    resetPasswordToken: String,
    resetPasswordExpire: Date,
    createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model('User', UserSchema);
