const router = require('express').Router();
const Calculation = require('../models/calculation');

router.post('/calculate', async (req, res) => {
    try {
        const { method, inputs, result, steps } = req.body;
        const calculation = new Calculation({
            method,
            inputs,
            result,
            steps
        });
        const savedCalculation = await calculation.save();
        res.json(savedCalculation);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});


router.get('/history', async (req, res) => {
    try {
        const calculations = await Calculation.find().sort({ createdAt: -1 });
        res.json(calculations);
    } catch (err) {
        res.status(500).json({ message: err.message });
    }
});

module.exports = router;