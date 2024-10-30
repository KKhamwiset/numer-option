const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://numer-option-second.vercel.app',
        'https://numer-option-second.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));

// Connect to database
connectDB();

app.get('/', (req, res) => {
    res.json({ message: "Numer Option API is running" });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});

// API routes
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
    console.log('404 hit for path:', req.path);
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path 
    });
});

module.exports = app;