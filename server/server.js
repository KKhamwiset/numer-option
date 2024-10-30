const express = require('express');
const cors = require('cors');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
require('dotenv').config();

const app = express();


app.use(cors({
    origin: [
        'http://localhost:3000',
        'https://numer-option.vercel.app/',
        'https://numer-option-second.vercel.app',
        'https://numer-option-second.vercel.app/'
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
}));

app.use(express.json());
app.use(bodyParser.json({ limit: "30mb" }));


connectDB();

app.get('/', (req, res) => {
    res.json({ message: "Numer Option API is running" });
});

app.get('/api/test', (req, res) => {
    res.json({ message: "API is working" });
});



module.exports = app;