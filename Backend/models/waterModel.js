const mongoose = require('mongoose');

const waterSchema = mongoose.Schema({
    user: {
        type: mongoose.Schema.Types.ObjectId,
        required: true,
        ref: 'User',
    },
    userName: {
        type: String,
        required: true,
    },
    date: {
        type: Date,
        required: true,
    },
    goal: {
        type: Number,
        required: true,
        default: 2000, // Default goal in ml
    },
    consumed: {
        type: Number,
        required: true,
        default: 0,
    },
    lastDrinkAt: {
        type: Date,
        required: false,
    },
}, {
    timestamps: true,
});

const Water = mongoose.model('Water', waterSchema);

module.exports = Water; 