const mongoose = require('mongoose');

const billSchema = new mongoose.Schema({
    consumerName: {
        type: String,
        required: true,
    },
    planName: {
        type: String,
        required: true,
    },
    unitsIncluded: {
        type: Number,
        required: true,
    },
    unitsUsed: {
        type: Number,
        required: true,
    },
    remainingUnits: {
        type: Number,
        required: true,
    },
    status: {
        type: String,
        required: true,
    },
    paymentDate: {
        type: Date,
        default: Date.now,
    },
    paymentMode: {
        type: String, // 'Credit Card', 'UPI', 'Net Banking'
        required: false
    },
    description: {
        type: String,
        required: false
    },
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: 'User',
        required: false // Optional for now to keep backward compatibility or if guest checkout allowed
    }
});

module.exports = mongoose.model('Bill', billSchema);
