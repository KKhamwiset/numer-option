const router = require('express').Router();
const mainCalculation = require('../controller/rootofeq');
// สร้าง Endpoint สำหรับการบันทึกข้อมูลที่ path
/**
 * @swagger
 * /api/rootofEQ:
 *   post:
 *     summary: Add data to DB
  *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object 
 *             properties:
 *               x_start:
 *                 type: string
 *               x_end:
 *                 type: string
 *               equation:
 *                 type: string
 *               answer:
 *                 type: string
 *               subtype:
 *                 type: string
 *             required:
 *               - x_start
 *               - x_end
 *               - equation
 *               - answer
 *               - subtype
 *     responses: 
 *       200:
 *         description: A list of items
 */
router.post('/', mainCalculation._sendRootEQ);


/**
 * @swagger
 * /api/rootofEQ/{id}:
 *   delete:
 *     summary: Delete specific item
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses: 
 *       200:
 *         description: A list of items
 */
router.delete('/:id', mainCalculation._deleteCalculation);

module.exports = router;