const rounter = require('express').Rounter();
const tb_controller = require('../controller/tableItem');

rounter.get('/',tb_controller._getTable)

module.exports = rounter