const mongoose = require('mongoose');

// กำหนด Schema

const calculationSchema = new mongoose.Schema({
    dataSet : Object,
    type : String
}, {timestamps: true})

module.exports = mongoose.model('result', calculationSchema);