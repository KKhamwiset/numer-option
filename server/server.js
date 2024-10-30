const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI)
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use(morgan("dev"))
app.use(bodyParser.json({ limit: "30mb",}));
app.use('/api/calculate', numerRoutes);

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;