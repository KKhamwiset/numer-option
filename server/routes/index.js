const router = require('express').Router();
const rootofEquationApi = require('./rootofEQ')
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path

router.use('/rootofEQ', rootofEquationApi);


module.exports = router;