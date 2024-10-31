const dataTemplate = require('../models/blueprint');

class rootOfEquation {
    
    static async _getData(req, res) {
        try {      
            try {
                const calculations = await dataTemplate.find().limit(20);                
                res.status(200).json({ data: calculations });
            } catch (error) {
                console.error(error);
                res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
    }

    static async _createTable(req, res) {
        try {
            // ดึงข้อมูลจาก req.body
            const {x_start, x_end, equation, answer, subtype} = req.body;
            
            // ตรวจสอบว่าได้รับค่าที่จำเป็นทั้งหมด
            if (x_start === undefined || x_end === undefined || !equation || answer === undefined || subtype === undefined) {
                return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }
    
            // สร้าง instance ของ Calculation เพื่อบันทึกข้อมูลลง MongoDB
    
            const newCalculation = await dataTemplate({
                'dataSet.equation' : equation,
                'dataSet.Xstart' : x_start,
                'dataSet.Xend' : x_end,
                'dataSet.answer' : answer,
                'dataSet.subtype' : subtype
            })
    
            // บันทึกข้อมูลใน MongoDB
            await newCalculation.save();
    
            // ส่ง response กลับไปที่ client
            res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', data: newCalculation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
    }
    static async _testDeploy(req, res) {
        try {
            const message = 'Hello, World!';
            res.status(200).json({ message });
        } catch (error) {
            console.error(error);
        }
    }
}

module.exports = rootOfEquation;