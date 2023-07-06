const mongoose = require('mongoose');

const referenceDataSchema = new mongoose.Schema({
  item: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
  },
  rate: {
    type: Number,
    required: true,
  },
  unit: {
    type: String,
    required: true,
  },
  
   
}, {collection: 'referenceData'});

module.exports = mongoose.model('ReferenceData', referenceDataSchema);
