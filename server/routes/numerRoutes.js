const router = require('express').Router();
const mainCalculation = require('../controller/calculation');

// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path /graphical
router.post('/', mainCalculation._createTable);
router.get('/', mainCalculation._getData);
module.exports = router;