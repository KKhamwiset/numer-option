const router = require('express').Router();
const tb_controller = require('../controller/tableItem');

/**
 * @swagger
 * /api/table:
 *   get:
 *     summary: Retrieve a list of items
 *     responses:
 *       200:
 *         description: A list of items
 */
router.get('/', tb_controller._getTable)

module.exports = router
