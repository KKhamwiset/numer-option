const dataTemplate = require('../models/blueprint')

class LinearAlgebra {
    static async _setLinearAlgebra(req,res) {
        try {
            const {matrixA,matrixB,matrixX,subtype,maintype} = req.body;

            if (matrixA === undefined || matrixB === undefined || matrixX === undefined) {
                return res.status(400).json({ message: 'กรุณากรอกข้อมูลให้ครบถ้วน' });
            }
            const newCalculation = await dataTemplate({
                'type': maintype,
                'dataSet.subtype': subtype,
                'dataSet.matrixA' : matrixA,
                'dataSet.matrixB' : matrixB,
                'dataSet.matrixX' : matrixX
            });
            await newCalculation.save();
            res.status(201).json({ message: 'บันทึกข้อมูลสำเร็จ', data: newCalculation });
        } 
        catch (e) {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการบันทึกข้อมูล' });
        }
    }
}
module.exports = LinearAlgebra;