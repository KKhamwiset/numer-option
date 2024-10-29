const mongoose = require('mongoose');

// กำหนด Schema
const calculationSchema = new mongoose.Schema({
    dataobject : Object,
    type : String
}, {timestamps: true})
/*
const calculationSchema = new mongoose.Schema({
    x_start: {
        type: Number,
        required: true
    },
    x_end: {
        type: Number,
        required: true
    },
    equation: {
        type: String,
        required: true
    },
    answer: {
        type: Number,
        required: true
    },
    createdAt: {
        type: Date,
        default: Date.now
    }
});

/*
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
*/

module.exports = mongoose.model('Calculation', calculationSchema);