const router = require('express').Router();
const Graphical = require('../controller/calulation');
const Calculation = require('../models/calculation');

// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path /graphical
router.post('/', Graphical._createGraphical);
router.get('/', Graphical._getGraphical);

module.exports = router;