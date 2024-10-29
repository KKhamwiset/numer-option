const router = require('express').Router();
const Calculation = require('../models/calculation');

router.post('/calculate', async (req, res) => {
    try {
        const { method, inputs, result } = req.body;
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

module.exports = router;