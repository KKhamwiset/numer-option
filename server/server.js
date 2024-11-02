const express = require('express');
const cors = require('cors');
const indexRounter = require('./routes/index');
const bodyParser = require('body-parser');
const connectDB = require('./config/db');
const Swagger = require('./swagger');
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

app.use((req, res, next) => {
    res.setHeader('Access-Control-Allow-Origin', 'https://numer-option-final.vercel.app');
    res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');
    initDB();
    next();
});

app.use(cors({
    origin:
    [
        'http://localhost:5173',
        'https://numer-option-final.vercel.app',
    ],
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    credentials: true,
    optionsSuccessStatus: 200
}));

app.use(express.json({ limit: '10mb' }));
app.use(bodyParser.json({ limit: '10mb' }));



app.use('/api-docs', Swagger.serve, Swagger.swaggerUi.setup(
    Swagger.swaggerSpec,Swagger.swaggerUiOptions));


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

app.use('/api',indexRounter);

module.exports = app;


if (process.env.NODE_ENV !== 'production') {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server running on port ${PORT}`);
    });
}