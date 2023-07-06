const express = require('express');
const router = express.Router();
const productController = require('../controllers/productController');



// GET /api/product-fields
router.get('/', productController.getProducts);

// Route for adding a product
router.post('/', productController.addProduct);

// POST /api/product-fields
//router.post('/', productController.createProduct);

// PUT /api/product-fields/:id
router.put('/:id', productController.updateProduct);

// DELETE /api/product-fields/:id
router.delete('/:id', productController.deleteProduct);

module.exports = router;
