const router = require('express').Router();
const mainCalculation = require('../controller/calculation');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path
router.post('/calculate', mainCalculation._createTable);
router.get('/calculate', mainCalculation._getData);
module.exports = router;