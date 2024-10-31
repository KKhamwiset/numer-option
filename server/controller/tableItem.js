const dataTemplate = require('./models/blueprint');
class Table {
    static async _getTable (res,req) {
        try {
            const calculations = await dataTemplate.find().limit(20);
            res.status(200).json({ data: calculations });
        }
        catch(e) {
            res.status(500).json({ message: 'เกิดข้อผิดพลาดในการดึงข้อมูล' });
        }
    }
}

module.exports = Table;