const router = require('express').Router();
const bisection = require('bisection');
const graphical = require('graphical');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path

router.use('/bisection', bisection);
router.use('/graphical', graphical);


module.exports = router;