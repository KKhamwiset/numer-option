const router = require('express').Router();
const rootofEquationApi = require('./rootofEQ')
const table = require('./table')
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path

router.use('/rootofEQ', rootofEquationApi);
router.use('/table', table);

module.exports = router;