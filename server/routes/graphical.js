const router = require('express').Router();
const mainCalculation = require('../controller/rootofeq');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path
router.post('/', mainCalculation._sendBisection);


module.exports = router;