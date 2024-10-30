const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();
connectDB()
// MongoDB connection optimization
let cachedDb = null;
app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));

// Connect to MongoDB before handling requests
app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});

app.get('/', (req, res) => {
    res.json({ message: "Numer Option API is running" });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});

// Add timeout middleware for API routes
app.use('/api', (req, res, next) => {
    // Set timeout for API routes to 9 seconds (Vercel limit is 10s)
    req.setTimeout(9000, () => {
        res.status(408).json({ error: 'Request timeout' });
    });
    next();
});

app.use('/api', numerRoutes);

// Error handling
app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
    });
});

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path 
    });
});

module.exports = app;