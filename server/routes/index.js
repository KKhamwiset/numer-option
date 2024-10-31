const router = require('express').Router();
const bisection = require('bisection');
const graphical = require('graphical');
const table = require('table');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path

router.use('/bisection', bisection);
router.use('/graphical', graphical);
router.use('/table', table);


module.exports = router;