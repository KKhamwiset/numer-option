// api/index.js
const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
require('dotenv').config();

// Initialize express
const app = express();

// Enhanced error handling middleware
const errorHandler = (err, req, res, next) => {
    console.error('Detailed error:', {
        message: err.message,
        stack: err.stack,
        path: req.path,
        method: req.method,
        body: req.body,
        query: req.query,
        timestamp: new Date().toISOString()
    });

    // Handle different types of errors
    if (err.name === 'ValidationError') {
        return res.status(400).json({
            status: 'error',
            type: 'ValidationError',
            message: err.message,
            details: Object.values(err.errors).map(e => e.message)
        });
    }

    if (err.name === 'MongooseError') {
        return res.status(503).json({
            status: 'error',
            type: 'DatabaseError',
            message: 'Database connection error'
        });
    }

    // Default error response
    res.status(500).json({
        status: 'error',
        type: 'ServerError',
        message: process.env.NODE_ENV === 'production' 
            ? 'Internal server error' 
            : err.message
    });
};

// Middleware
app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://numer-option.vercel.app',
        'https://numer-option-second.vercel.app'
    ],
    credentials: true
}));
app.use(express.json());

// Database connection with retry logic
const connectDB = async (retries = 5) => {
    while (retries > 0) {
        try {
            await mongoose.connect(process.env.MONGODB_URI, {
                useNewUrlParser: true,
                useUnifiedTopology: true,
                serverSelectionTimeoutMS: 5000
            });
            console.log('MongoDB connected successfully');
            return true;
        } catch (error) {
            console.error(`Database connection attempt failed. Retries left: ${retries-1}`);
            retries--;
            if (retries === 0) {
                throw new Error('Failed to connect to database after multiple attempts');
            }
            // Wait 2 seconds before retrying
            await new Promise(resolve => setTimeout(resolve, 2000));
        }
    }
};

// Basic health check route
app.get('/api/health', async (req, res) => {
    try {
        const dbStatus = mongoose.connection.readyState === 1 ? 'connected' : 'disconnected';
        
        res.json({
            status: 'healthy',
            database: dbStatus,
            timestamp: new Date().toISOString(),
            environment: process.env.NODE_ENV
        });
    } catch (error) {
        next(error);
    }
});

// Main route handler
app.get('/api', async (req, res) => {
    try {
        // Ensure database is connected
        if (mongoose.connection.readyState !== 1) {
            await connectDB();
        }

        res.json({
            message: "Numer Option API is running",
            status: "success",
            timestamp: new Date().toISOString()
        });
    } catch (error) {
        next(error);
    }
});

// Apply error handler
app.use(errorHandler);

// 404 handler
app.use((req, res) => {
    res.status(404).json({
        status: 'error',
        message: 'Route not found',
        path: req.path,
        method: req.method
    });
});

// Export the express app
module.exports = app;