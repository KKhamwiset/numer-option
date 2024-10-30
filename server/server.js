const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');

require('dotenv').config();

const app = express();
connectDB()
app.use(cors({
    origin: ['https://numer-option-second.vercel.app',
             'https://numer-option-second.vercel.app/'],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));


app.get('/', (req, res) => {
    res.json({ message: "Numer Option API is running" });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});

app.use('/api', (req, res, next) => {
    req.setTimeout(9000, () => {
        res.status(408).json({ error: 'Request timeout' });
    });
     next();
});

app.use('/api', numerRoutes);

app.use((err, req, res, next) => {
    console.error('Error:', err);
    res.status(500).json({ 
        error: 'Something broke!',
        message: err.message 
    });
});

app.use((req, res) => {
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path 
    });
});

module.exports = app;