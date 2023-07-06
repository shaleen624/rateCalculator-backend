const mongoose = require('mongoose');

const referenceDataHistorySchema = new mongoose.Schema({
  referenceDataId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'ReferenceData',
    required: true,
  },
  oldData: {
    type: Object,
    required: false,
  },
  newData: {
    type: Object,
    required: false,
  },
  changes: {
    type: Object,
    required: false,
  },
  action: {
    type: String,
    required: true,
  },
  timestamp: {
    type: Date,
    default: Date.now,
  },
}, {collection: 'referenceDataHistory'});

module.exports = mongoose.model('ReferenceDataHistory', referenceDataHistorySchema);
