const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const numerRoutes = require('./routes/numerRoutes');

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect(process.env.MONGODB_URI, {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));

app.use('/api/calculate', numerRoutes);
app.get('/api/health', (req, res) => {
    res.json({ status: 'ok' });
});

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;