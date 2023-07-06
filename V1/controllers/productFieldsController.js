const ProductField = require('../models/productField');

// GET /api/product-fields
exports.getProductFields = async (req, res) => {
  try {
    const productFields = await ProductField.find();
    res.json(productFields);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// POST /api/product-fields
exports.createProductField = async (req, res) => {
  try {
    const productField = new ProductField(req.body);
    await productField.save();
    res.json(productField);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// PUT /api/product-fields/:id
exports.updateProductField = async (req, res) => {
  try {
    const updatedProductField = await ProductField.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProductField);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};

// DELETE /api/product-fields/:id
exports.deleteProductField = async (req, res) => {
  try {
    await ProductField.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product field deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error' });
  }
};
