const jwt = require('jsonwebtoken');

const JWT_SECRET = process.env.JWT_SECRET || 'your_super_secret_key_123';

const verifyToken = (req, res, next) => {
    const token = req.header('auth-token');
    if (!token) return res.status(401).json({ message: 'Access Denied' });

    try {
        const verified = jwt.verify(token, JWT_SECRET);
        req.user = verified;
        next();
    } catch (err) {
        res.status(400).json({ message: 'Invalid Token' });
    }
};

const verifyAdmin = (req, res, next) => {
    verifyToken(req, res, () => {
        // We need to fetch the user from DB to verify role, or we can embed role in token.
        // For now, let's assume we will embed role in token or fetch here.
        // Simplest: fetch user from DB.
        const User = require('../models/User');
        User.findById(req.user._id).then(user => {
            if (user && user.role === 'admin') {
                next();
            } else {
                res.status(403).json({ message: 'Admin Access Required' });
            }
        }).catch(err => res.status(500).json({ message: 'Internal Server Error' }));
    });
};

module.exports = { verifyToken, verifyAdmin };
