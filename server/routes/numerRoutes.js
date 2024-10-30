const router = require('express').Router();
const mainCalculation = require('../controller/calculation');
// const testmsg = require('../controller/test');

// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path /graphical
router.post('/', mainCalculation._createTable);
router.get('/', mainCalculation._getData);
// router.get('/',testmsg._testDeploy)
module.exports = router;