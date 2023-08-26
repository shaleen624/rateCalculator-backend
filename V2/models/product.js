const mongoose = require('mongoose');

// Define the dynamic configuration object for the fields
const fieldsConfig = {
    name: { type: String, required: true },
    size: { type: String, required: true },
    category: { type: String, required: true },
    //fabric: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReferenceData' }],
    //fiber: [{ type: mongoose.Schema.Types.ObjectId, ref: 'ReferenceData' }],
    fabric: [{ type: Object }],
    fiber: [{ type: Object }],
    cutting: { type: Number },
    stitching: { type: Number },
    finishing: { type: Number },
    printEmb: { type: Number },
    eyeNose: { type: Number },
    bow: { type: Number },
    packing: { type: Number },
    chainLock: { type: Number },
    overhead: { type: Number },
    others: { type: Number },
    totalPrice: { type: Number },
    // Add more fields as needed
};

// Create the dynamic schema based on the fields configuration
const productSchema = new mongoose.Schema(fieldsConfig, { collection: 'products' });

const Product = mongoose.model('Product', productSchema);

module.exports = Product;
