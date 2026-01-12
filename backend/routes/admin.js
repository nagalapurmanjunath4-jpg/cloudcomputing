const router = require('express').Router();
const Plan = require('../models/Plan');
const { verifyAdmin } = require('../middleware/verifyToken');

// CREATE Plan
router.post('/plans', verifyAdmin, async (req, res) => {
    try {
        const newPlan = new Plan(req.body);
        const savedPlan = await newPlan.save();
        res.status(201).json(savedPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// GET All Plans (Admin view might want to see all, including archived)
router.get('/plans', verifyAdmin, async (req, res) => {
    try {
        const plans = await Plan.find().sort({ createdAt: -1 });
        res.json(plans);
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

// UPDATE Plan
router.put('/plans/:id', verifyAdmin, async (req, res) => {
    try {
        const updatedPlan = await Plan.findByIdAndUpdate(req.params.id, req.body, { new: true });
        res.json(updatedPlan);
    } catch (err) {
        res.status(400).json({ error: err.message });
    }
});

// DELETE Plan (Soft delete or Hard delete? Let's do Hard for now as asked, or Soft via status)
router.delete('/plans/:id', verifyAdmin, async (req, res) => {
    try {
        await Plan.findByIdAndDelete(req.params.id);
        res.json({ message: 'Plan deleted' });
    } catch (err) {
        res.status(500).json({ error: err.message });
    }
});

module.exports = router;
