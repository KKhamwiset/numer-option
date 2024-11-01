const router = require('express').Router();
const setData = require('../controller/linearAlgebra');
/**
 * @swagger
 * /api/linear:
 *   post:      
 *     summary: Add data to DB
 *     description: Adds a new set of data to the database.
 *     tags:
 *       - Linear Algebra   (linear)    
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               matrixA: Array of numbers
 *               matrixB: Array of numbers
 *               matrixX: Array of numbers
 *               subtype:
 *                 type: string
 *                 description: The subtype of the calculation.
 *               maintype:
 *                 type: string
 *                 description: The main type of the calculation.
 *     responses:
 *       200:   Success
 *       400:   Bad Request
 *       500:   Internal Server Error
 */
router.post('/', setData._setLinearAlgebra);
module.exports = router;