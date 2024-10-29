const router = require('express').Router();
const Calculation = require('../models/calculation');



// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path /graphical
router.post('/graphical', async (req, res) => {
    try {
        // ดึงข้อมูลจาก req.body
        const {x_start, x_end, equation, answer} = req.body;
        
        // ตรวจสอบว่าได้รับค่าที่จำเป็นทั้งหมด
        if (x_start === undefined || x_end === undefined || !equation || answer === undefined) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // สร้าง instance ของ Calculation เพื่อบันทึกข้อมูลลง MongoDB
        const newCalculation = new Calculation({
            x_start,
            x_end,
            equation,
            answer
        });

        // บันทึกข้อมูลใน MongoDB
        await newCalculation.save();

        // ส่ง response กลับไปที่ client
        res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', data: newCalculation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
})

router.get('/graphical', async (req, res) => {
    try {      
        try {
            const calculations = await Calculation.find().limit(20);
            res.status(200).json({ data: calculations });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
        }
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
})

router.post('/bisection', async (req, res) => {
    try {
        // ดึงข้อมูลจาก req.body
        const {x_start, x_end, equation, answer} = req.body;
        
        // ตรวจสอบว่าได้รับค่าที่จำเป็นทั้งหมด
        if (x_start === undefined || x_end === undefined || !equation || answer === undefined) {
            return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
        }

        // สร้าง instance ของ Calculation เพื่อบันทึกข้อมูลลง MongoDB
        const newCalculation = new Calculation({
            x_start,
            x_end,
            equation,
            answer
        });

        // บันทึกข้อมูลใน MongoDB
        await newCalculation.save();

        // ส่ง response กลับไปที่ client
        res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', data: newCalculation });
    } catch (error) {
        console.error(error);
        res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
    }
})

module.exports = router;