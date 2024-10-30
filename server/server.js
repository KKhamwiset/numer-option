const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const morgan = require('morgan');
const numerRoutes = require('./routes/numerRoutes');
const bodyParser = require('body-parser');

const app = express();


app.use(cors());
app.use(express.json());


mongoose.connect("mongodb+srv://kritsakorn224:FzdYd1ZQyi0usZVg@cluster0.qftnd.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0", {
    useNewUrlParser: true,
    useUnifiedTopology: true
})
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