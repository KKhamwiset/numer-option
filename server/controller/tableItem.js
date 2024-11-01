const dataTemplate = require('../models/blueprint');

class Table {
    static async _getTable (req, res) {
        try {
            const calculations = await dataTemplate.find().sort({ createdAt: -1 }).limit(20);
            res.status(200).json({ data: calculations });
        }
        catch(e) {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
        }
    }
    static async _deleteItem(req, res) {
        try {
            const id = req.params.id;
            const deletedData = await dataTemplate.findByIdAndDelete(id);
            if (deletedData) {
                res.status(200).json({ message: "Data deleted successfully" });
            } else {
                res.status(404).json({ message: "Data not found" });
            }
        } catch (error) {
            console.error(error);
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการลบข้อมูล' });
        }  
    }
}

module.exports = Table;