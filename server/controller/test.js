const dataTemplate = require('../models/blueprint')

class msg {
    static _testDeploy = async (req,res) => {
        const msg = await 'Hello, World!';
        res.status(200).json({ msg });
    }
}