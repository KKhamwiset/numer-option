const router = require('express').Router();
const mainCalculation = require('../controller/rootofeq');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path
router.post('/', mainCalculation._createTable);
router.get('/', mainCalculation._getData);

module.exports = router;