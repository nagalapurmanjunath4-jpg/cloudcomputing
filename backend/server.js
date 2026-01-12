require('dotenv').config();
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const paymentRoutes = require('./routes/payment');
const authRoutes = require('./routes/auth');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());

// Database Connection
const MONGO_URI = process.env.MONGO_URI;

mongoose.connect(MONGO_URI)
    .then(() => console.log('MongoDB Connected to Atlas'))
    .catch(err => console.error('MongoDB Connection Error:', err));

// Routes
// Routes
app.use('/api/payment', paymentRoutes);
app.use('/api/auth', authRoutes);
app.use('/api/admin', require('./routes/admin'));

// Start Server
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
