const router = require('express').Router();
const rootofEquationAPI = require('./rootofEQ')
const linearAPI = require('./linear')
const table = require('./table')
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path

router.use('/rootofEQ', rootofEquationAPI);
router.use('/linearAlgebra', linearAPI);
router.use('/table', table);

module.exports = router;