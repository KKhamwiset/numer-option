// server.js
const express = require('express');
const cors = require('cors');
const numerRoutes = require('./routes/numerRoutes');
const testRounters = require('./routes/testRountes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


const initDB = async () => {
    try {
        await connectDB();
        console.log('Database connected successfully');
    } catch (error) {
        console.error('Database connection failed:', error);
    }
};

app.use(cors({
    origin: '*',
    // [
    //     'http://localhost:5000',
    //     'https://numer-option-second.vercel.app',
    //     'https://numer-option-second.vercel.app/',
    // ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));
initDB();

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

app.use('/api',numerRoutes);
app.use('/Root_of_Equation/Bisection/api/calculate', numerRoutes);

module.exports = app;

if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}