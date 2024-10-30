const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: '*',
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

app.use('/api', numerRoutes);

mongoose.connect("mongodb+srv://kritsakorn224:wDGzgpROazscmR13@cluster0.qftnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
    .then(() => console.log('Connected to MongoDB'))
    .catch(err => console.error('MongoDB connection error:', err));

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

app.use((req, res) => {
    console.log('404 hit for path:', req.path);
    res.status(404).json({ 
        error: 'Not Found',
        path: req.path 
    });
});

module.exports = app;