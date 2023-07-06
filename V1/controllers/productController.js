const Product = require('../models/product');

// Controller function for adding a product

// GET /api/product-fields
exports.getProducts = async (req, res) => {
  try {
    const productFields = await Product.find();
    res.json(productFields);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error', errorDetails: error });
  }
};
// POST /api/product-fields=
exports.addProduct = async (req, res) => {
  try {
    const productData = req.body;

    // Perform any additional validation if needed

    // Create a new product document
    const newProduct = new Product(productData);

    // Save the product to the database
    await newProduct.save();

    res.status(201).json({ success: true, message: 'Product added successfully' });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to add product', error });
  }
}

  // PUT /api/product-fields/:id
exports.updateProduct = async (req, res) => {
  try {
    const updatedProductField = await Product.findByIdAndUpdate(req.params.id, req.body, { new: true });
    res.json(updatedProductField);
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error in updateProduct', errorDetails: error });
  }
};

// DELETE /api/product-fields/:id
exports.deleteProduct = async (req, res) => {
  try {
    await Product.findByIdAndRemove(req.params.id);
    res.json({ message: 'Product field deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Internal Server Error in deleteProduct', errorDetails: error  });
  }
};