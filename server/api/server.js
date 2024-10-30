const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('../routes/numerRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

// Updated CORS configuration
app.use(cors({
    origin: [
        'https://numer-option-second.vercel.app'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));

// Test route to verify API is working
app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});

// Your routes
app.use('/api', numerRoutes);

// 404 handler
app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path
    });
});

module.exports = app;