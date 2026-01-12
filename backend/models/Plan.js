const mongoose = require('mongoose');

const planSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
        unique: true
    },
    pricePerUnit: {
        type: Number,
        required: true
    },
    unitsIncluded: {
        type: Number,
        required: true
    },
    validity: { // in days
        type: Number,
        required: true
    },
    status: {
        type: String, // 'Active', 'Archived'
        default: 'Active'
    },
    description: {
        type: String
    }
}, { timestamps: true });

module.exports = mongoose.model('Plan', planSchema);
