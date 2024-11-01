const router = require('express').Router();
const setData = require('../controller/rootofeq');
/**
 * @swagger
 * /api/rootofEQ:
 *   post:
 *     summary: Add data to DB
 *     description: Adds a new set of data to the database.
 *     tags:
 *       - Root Equations
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               x_start:
 *                 type: string
 *                 description: Starting value of x.
 *               x_end:
 *                 type: string
 *                 description: Ending value of x.
 *               equation:
 *                 type: string
 *                 description: The mathematical equation.
 *               answer:
 *                 type: string
 *                 description: The calculated answer.
 *               subtype:
 *                 type: string
 *                 description: Subtype of the equation.
 *             required:
 *               - x_start
 *               - x_end
 *               - equation
 *               - answer
 *               - subtype
 *     responses: 
 *       200:
 *         description: Successfully added the item.
 */
router.post('/', setData._sendRootEQ);
module.exports = router;