const express = require('express');
const router = express.Router();
const productFieldsController = require('../controllers/productFieldsController');

// GET /api/product-fields
router.get('/', productFieldsController.getProductFields);

// POST /api/product-fields
router.post('/', productFieldsController.createProductField);

// PUT /api/product-fields/:id
router.put('/:id', productFieldsController.updateProductField);

// DELETE /api/product-fields/:id
router.delete('/:id', productFieldsController.deleteProductField);

module.exports = router;
