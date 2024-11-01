const router = require('express').Router();
const tb_controller = require('../controller/tableItem');

/**
 * @swagger
 * /api/table:
 *   get:
 *     tags : 
 *          - Database
 *     summary: Retrieve a list of items
 *     responses:
 *       200:
 *         description: A list of items
 */
router.get('/', tb_controller._getTable)

/**
 * @swagger
 * /api/table/{id}:
 *   delete:
 *     summary: Delete specific item
 *     description: Deletes an item by its ID.
 *     tags:
 *       - Root Equations
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *         description: ID of the item to delete.
 *     responses: 
 *       200:
 *         description: Successfully deleted the item.
 *       404:
 *         description: Item not found.
 */

router.delete('/:id', tb_controller._deleteItem);

module.exports = router
