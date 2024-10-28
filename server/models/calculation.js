const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true,
        enum: ['OnePoint', 'NewtonRaphson', 'Secant', 'Simpson', 'Trapezoidal']
    },
    inputs: {
        type: Map,
        of: mongoose.Schema.Types.Mixed,
        required: true
    },
    result: {
        type: Number,
        required: true
    },
    steps: [{
        type: Map,
        of: String
    }],
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Calculation', calculationSchema);