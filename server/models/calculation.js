const mongoose = require('mongoose');

const calculationSchema = new mongoose.Schema({
    method: {
        type: String,
        required: true,
        enum: ['Graphical', 'Bisection', 'False-Position', 'One-Point_Iteration', 'Newton-Rhapson',
             'Secant', 'Simpson', 'Trapezoidal']
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
    createdAt: {
        type: Date,
        default: Date.now
    }
});

module.exports = mongoose.model('Calculation', calculationSchema);