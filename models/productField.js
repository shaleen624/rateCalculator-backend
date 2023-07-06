const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const SubSchema = new Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  required: {
    type: Boolean,
    required: true
  }
});


const productFieldSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  label: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  fields: {
    //type: [Schema.Types.Mixed],
    type:[SubSchema],
    required: false
  },
  required: {
    type: Boolean,
    required: true
  }
}, { collection: 'productFields' });

const ProductField = mongoose.model('ProductField', productFieldSchema);

module.exports = ProductField;
