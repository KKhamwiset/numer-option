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
    static async _sendBisection(req, res) {
        try {
            const {x_start, x_end, equation, answer, subtype} = req.body;
            
            if (x_start === undefined || x_end === undefined || !equation || answer === undefined || subtype === undefined) {
                return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }
    
    
            const newCalculation = await dataTemplate({
                'dataSet.equation' : equation,
                'dataSet.Xstart' : x_start,
                'dataSet.Xend' : x_end,
                'dataSet.answer' : answer,
                'dataSet.subtype' : subtype
            })
    
            await newCalculation.save();
            res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', data: newCalculation });
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
    }
}

module.exports = rootOfEquation;