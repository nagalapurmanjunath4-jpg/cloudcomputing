const mongoose = require('mongoose');
const Plan = require('./models/Plan');

const MONGO_URI = 'mongodb://127.0.0.1:27017/electricity_bill_system';

mongoose.connect(MONGO_URI)
    .then(async () => {
        console.log('Connected to DB');

        // Clear existing
        await Plan.deleteMany({});
        console.log('Cleared existing plans');

        // Create fresh
        const plans = [
            {
                name: 'Basic',
                pricePerUnit: 5,
                unitsIncluded: 100,
                validity: 30,
                status: 'Active',
                description: 'Best for low usage'
            },
            {
                name: 'Premium',
                pricePerUnit: 4,
                unitsIncluded: 500,
                validity: 45,
                status: 'Active',
                description: 'Best for heavy usage'
            },
            {
                name: 'Ultra',
                pricePerUnit: 3.5,
                unitsIncluded: 1000,
                validity: 60,
                status: 'Active',
                description: 'For industrial usage'
            }
        ];

        await Plan.insertMany(plans);
        console.log('Seeded 3 Active Plans');

        const verification = await Plan.find({ status: 'Active' });
        console.log('Verified Active Plans:', verification.length);

        process.exit(0);
    })
    .catch(err => {
        console.error(err);
        process.exit(1);
    });
