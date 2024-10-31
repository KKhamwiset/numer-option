// server.js
const express = require('express');
const cors = require('cors');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();

// Initialize database with error handling
const initDB = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
        // Don't exit process in serverless environment
    }
};

 // CORS configuration
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://numer-option.vercel.app',
        'https://numer-option.vercel.app/',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

// Body parsing middleware
app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));

// Initialize database
initDB();

// Health check route
app.get('/', async (req, res) => {
    try {
        res.json({ 
            message: "Numer Option API is running",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Health check error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Test route
app.get('/api/test', async (req, res) => {
    try {
        res.json({ 
            message: "API is working",
            env: process.env.NODE_ENV,
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        console.error('Test route error:', error);
        res.status(500).json({ error: 'Server error' });
    }
});

// Routes
app.use('/api', numerRoutes);

// Error handling middleware

// Export the Express application
module.exports = app;

// Only listen if not in Vercel environment
if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}