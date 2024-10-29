const Calculation = require('../models/calculation');
class Graphical {

    static async _getGraphical(req, res) {
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
    }

    static async _createGraphical(req, res) {
        try {
            // ดึงข้อมูลจาก req.body
            const {x_start, x_end, equation, answer, subtype} = req.body;
            
            // ตรวจสอบว่าได้รับค่าที่จำเป็นทั้งหมด
            if (x_start === undefined || x_end === undefined || !equation || answer === undefined || subtype === undefined) {
                return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }
    
            // สร้าง instance ของ Calculation เพื่อบันทึกข้อมูลลง MongoDB
    
            const newCalculation = await Calculation({
                'dataobject.equation' : equation,
                'dataobject.Xstart' : x_start,
                'dataobject.Xend' : x_end,
                'dataobject.answer' : answer,
                'dataobject.subtype' : subtype
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
}

module.exports = Graphical