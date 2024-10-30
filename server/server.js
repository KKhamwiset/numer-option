const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');
require('dotenv').config();
const app = express();

app.use(cors(
    {
        origin : 'https://numer-option-second.vercel.app/',
        method : ['GET', 'POST'],
        credentials : true
    }
));
app.use(express.json());

app.get('/', (req, res) => {
    res.json("Hello,world!");
})
mongoose.connect("mongodb+srv://kritsakorn224:wDGzgpROazscmR13@cluster0.qftnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => console.log('Connected to MongoDB'))
.catch(err => console.error('MongoDB connection error:', err));


app.use(bodyParser.json({ limit: "30mb",}));
app.use('/api', numerRoutes);

if (require.main === module) {
    const PORT = process.env.PORT || 5000;
    app.listen(PORT, () => {
        console.log(`Server is running on port ${PORT}`);
    });
}

module.exports = app;