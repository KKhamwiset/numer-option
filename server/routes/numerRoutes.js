const router = require('express').Router();
const mainCalculation = require('../controller/calculation');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path
router.post('/Root_of_Equation/calculate', mainCalculation._createTable);
router.get('/Root_of_Equation/calculate', mainCalculation._getData);

module.exports = router;