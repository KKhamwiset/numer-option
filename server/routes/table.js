const router = require('express').Router();
const tb_controller = require('../controller/tableItem');

router.get('/', tb_controller._getTable)

module.exports = router
