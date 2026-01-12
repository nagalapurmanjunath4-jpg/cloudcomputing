const express = require('express');
const router = express.Router();
const Bill = require('../models/Bill');
const Plan = require('../models/Plan');
const mongoose = require('mongoose');

// GET /api/payment/plans/active - Fetch active plans for users
router.get('/plans/active', async (req, res) => {
    try {
        const plans = await Plan.find({ status: 'Active' });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: 'Failed to fetch plans' });
    }
});

router.post('/paybill', async (req, res) => {
    try {
        const { consumerName, planName, unitsUsed, paymentMode, description, userId } = req.body;

        if (!consumerName || !planName || unitsUsed === undefined) {
            return res.status(400).json({ error: 'Missing required fields' });
        }

        // 1. Fetch Plan Details from DB
        const selectedPlan = await Plan.findOne({ name: planName });
        if (!selectedPlan) {
            return res.status(404).json({ error: 'Plan not found' });
        }

        // 2. Check Plan Status
        if (selectedPlan.status !== 'Active') {
            return res.json({
                paymentStatus: 'Plan Expired',
                remainingUnits: 0,
                message: 'Plan Is Not Active'
            });
        }

        // 3. Calculate Remaining Units & Determine Status
        let status = '';
        let remainingUnits = 0;
        const unitsIncluded = selectedPlan.unitsIncluded;

        if (unitsUsed <= unitsIncluded) {
            status = 'Payment Successful';
            remainingUnits = unitsIncluded - unitsUsed;
        } else {
            status = 'Insufficient Units';
            remainingUnits = unitsIncluded - unitsUsed; // Can be negative
        }

        // 4. Save Record in MongoDB
        const newBill = new Bill({
            consumerName,
            planName,
            unitsIncluded,
            unitsUsed,
            remainingUnits,
            status: status,
            paymentDate: new Date(),
            paymentMode: paymentMode || 'Not Specified',
            description: description || '',
            userId: userId || null
        });

        const savedBill = await newBill.save();

        // 5. Send JSON Response
        res.json({
            success: true,
            message: status,
            paymentStatus: status,
            remainingUnits: remainingUnits,
            billId: newBill._id
        });

    } catch (error) {
        console.error('Payment Error:', error);
        res.status(500).json({ error: 'Internal Server Error' });
    }
});

// GET /api/payment/user/:userId - Fetch all bills for a user with filters
router.get('/user/:userId', async (req, res) => {
    try {
        const { startDate, endDate, status } = req.query;
        let query = { userId: req.params.userId };

        if (status && status !== 'All') {
            query.status = status; // e.g., 'Payment Successful'
        }

        if (startDate || endDate) {
            query.paymentDate = {};
            if (startDate) query.paymentDate.$gte = new Date(startDate);
            if (endDate) query.paymentDate.$lte = new Date(endDate);
        }

        const bills = await Bill.find(query).sort({ paymentDate: -1 });
        res.json(bills);
    } catch (error) {
        console.error('Error fetching bills:', error);
        res.status(500).json({ error: 'Failed to fetch bills' });
    }
});

// GET /api/payment/analytics/:userId - Usage analytics
router.get('/analytics/:userId', async (req, res) => {
    try {
        const userId = req.params.userId;
        const sixMonthsAgo = new Date();
        sixMonthsAgo.setMonth(sixMonthsAgo.getMonth() - 6);

        const analytics = await Bill.aggregate([
            {
                $match: {
                    userId: new mongoose.Types.ObjectId(userId),
                    paymentDate: { $gte: sixMonthsAgo }
                }
            },
            {
                $group: {
                    _id: { $month: "$paymentDate" }, // Group by month (1-12)
                    totalUnits: { $sum: "$unitsUsed" },
                    totalCost: { $sum: 0 }, // If we had cost, we'd sum it here. For now 0
                    count: { $sum: 1 }
                }
            },
            { $sort: { "_id": 1 } }
        ]);

        // Map month numbers to names for frontend convenience if needed, 
        // or just send the array and let frontend handle mapping.
        res.json(analytics);

    } catch (err) {
        console.error('Analytics Error:', err);
        res.status(500).json({ error: 'Failed to fetch analytics' });
    }
});

// DELETE /api/payment/:id - Delete a bill
router.delete('/:id', async (req, res) => {
    try {
        const result = await Bill.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Bill not found' });
        }
        res.json({ success: true, message: 'Bill deleted successfully' });
    } catch (error) {
        console.error('Error deleting bill:', error);
        res.status(500).json({ error: 'Failed to delete bill' });
    }
});

module.exports = router;
