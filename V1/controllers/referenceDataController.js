const ReferenceData = require('../models/referenceData');
const ReferenceDataHistory = require('../models/referenceDataHistory');

const action = {
  CREATE: "Create",
  UPDATE: "Update",
  DETELE: "Delete"
}

// Get all reference data
exports.getAllReferenceData = async (req, res) => {
  try {
    console.log('getAllReferenceData called');
    const referenceData = await ReferenceData.find();
    res.json(referenceData);
  } catch (error) {
    res.status(500).json({ error: 'Server error', errorDetails: error });
  }
};

// Get a specific reference data by ID
exports.getReferenceDataById = async (req, res) => {
  try {
    const id = req.params.id;
    const referenceData = await ReferenceData.findById(id);

    if (!referenceData) {
      return res.status(404).json({ error: 'Reference data not found' });
    }

    res.json(referenceData);
  } catch (error) {
    res.status(500).json({ error: 'Server error getReferenceDataById', errorDetails: error });
  }
};

// Search reference data by item
exports.searchReferenceData = async (req, res) => {
  try {
    const searchTerm = req.query.term;
    console.log("searchTerm for search", searchTerm);

    const regex = new RegExp(searchTerm, 'i'); // Case-insensitive search using regular expression

    const referenceData = await ReferenceData.find({ item: regex });

    res.json(referenceData);
  } catch (error) {
    console.error('Error while searching reference data:', error);
    res.status(500).json({ error: 'Server error', errorDetails: error });
  }
};


// Create new reference data
exports.createReferenceData = async (req, res) => {
  try {
    const { item, category, rate, unit } = req.body;
    const newData = req.body;
    const newReferenceData = new ReferenceData({ item, category, rate, unit });
    const savedReferenceData = await newReferenceData.save();
    saveHistory(savedReferenceData._id, action.CREATE, null, newReferenceData);
    res.json(savedReferenceData);
  } catch (error) {
    res.status(500).json({ error: 'Server error in create', errorDetails: error });
  }
};

// Update a reference data by ID
exports.updateReferenceData = async (req, res) => {
  try {
    const id = req.params.id;
    const updatedData = req.body;
    const { item, category, rate, unit } = req.body;

    //const updatedReferenceData = await ReferenceData.findByIdAndUpdate(id, { item, rate, unit }, { new: true });
    const referenceData = await ReferenceData.findById(id);
    if (!referenceData) {
      return res.status(404).json({ error: 'Reference data not found' });
    }
    const oldData = { ...referenceData.toObject() }; // Create a copy of the old data

    // Update the reference data with the new values
    referenceData.item = updatedData.item;
    referenceData.category = updatedData.category;
    referenceData.rate = updatedData.rate;
    referenceData.unit = updatedData.unit;

    const updatedReferenceData = await referenceData.save();
    debugger
    /*We use the modifiedPaths() method provided by Mongoose to get an array 
     * of modified paths (fields) in the referenceData object.
     * We then use reduce() to create a changes object by iterating over
     *  the modified paths and assigning the corresponding values from the updated referenceData. 
     * 
    const changes = updatedReferenceData.modifiedPaths()
      .reduce((obj, path) => {
        obj[path] = updatedReferenceData[path];
        return obj;
      }, {});
      console.log ("changes to Data>>>>>" ,JSON.stringify(changes));*/
    // if (Object.keys(changes).length === 0) {
    //   return res.status(400).json({ error: 'No changes detected' });
    // }
    console.log("Old Data>>>>>", JSON.stringify(oldData));
    console.log("Old Data>>>>>", JSON.stringify(updatedData));
    saveHistory(updatedReferenceData._id, action.UPDATE, oldData, updatedData);

    res.json(updatedReferenceData);
  } catch (error) {
    res.status(500).json({ error: 'Server error in update', errorDetails: error });
  }
};

// Delete a reference data by ID

exports.deleteReferenceData = async (req, res) => {
  try {
    const id = req.params.id;
    const deletedReferenceData = await ReferenceData.findByIdAndDelete(id);

    if (!deletedReferenceData) {
      return res.status(404).json({ error: 'Reference data not found' });
    }
    saveHistory(id, action.DETELE, deletedReferenceData, null);
    res.json({ message: 'Reference data deleted successfully' });
  } catch (error) {
    res.status(500).json({ error: 'Server error in delete', errorDetails: error });
  }
};

// Get all reference data combined by category
exports.combinedByCategory = async (req, res) => {
  ReferenceData.aggregate([
    {
      $group: {
        _id: '$category',
        data: { $push: { item: '$item', rate: '$rate', unit: '$unit' } },
      },
    },
  ])
    .then((combinedData) => {
      res.json(combinedData);
    })
    .catch((error) => {
      console.error('Error while getting combined reference data by category', error);
      res.status(500).json({ error: 'Error while getting combined reference data by category' });
    });
};



saveHistory = async (id, action, oldData, updatedData, changes) => {
  // Create a new history record
  debugger
  console.log("inside saveHistory Old Data>>>>>", JSON.stringify(oldData));
  const historyData = new ReferenceDataHistory({
    referenceDataId: id,
    newData: updatedData,
    oldData: oldData,
    //changes: changes,
    action: action,
  });
  console.log("Data to Save in history table", JSON.stringify(historyData))
  await historyData.save();

}
