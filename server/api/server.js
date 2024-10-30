const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('../routes/numerRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();

const app = express();

app.use(cors({
    origin: ['https://numer-option-second.vercel.app', 'https://numer-option-second.vercel.app/'], // Include both with and without trailing slash
    methods: ['GET', 'POST'],
    credentials: true
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));


app.get('/api/test', (req, res) => {
    res.json({ message: "Hello, world!" });
});

// Connect to MongoDB
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) {
        return cachedDb;
    }
    
    try {
        const client = await mongoose.connect(process.env.MONGODB_URI || "mongodb+srv://kritsakorn224:wDGzgpROazscmR13@cluster0.qftnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });
        cachedDb = client;
        return cachedDb;
    } catch (error) {
        console.error('MongoDB connection error:', error);
        throw error;
    }
}

app.use(async (req, res, next) => {
    try {
        await connectToDatabase();
        next();
    } catch (error) {
        res.status(500).json({ error: 'Database connection failed' });
    }
});


app.use('/api', numerRoutes);

app.use((err, req, res, next) => {
    console.error(err.stack);
    res.status(500).json({ error: 'Something broke!' });
});

module.exports = app;