const dataTemplate = require('../models/blueprint');

class rootOfEquation {
    
    static async _sendRootEQ(req, res) {
        try {
            const {x_start, x_end, equation, answer, subtype,maintype} = req.body;
            
            if (x_start === undefined || x_end === undefined || !equation || answer === undefined || subtype === undefined) {
                return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }
            const newCalculation = await dataTemplate({
                'type' : maintype,
                'dataSet.subtype' : subtype,
                'dataSet.equation' : equation,
                'dataSet.Xstart' : x_start,
                'dataSet.Xend' : x_end,
                'dataSet.answer' : answer,
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