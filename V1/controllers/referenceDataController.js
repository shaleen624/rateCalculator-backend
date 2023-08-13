const ReferenceData = require('../models/referenceData');
const ReferenceDataHistory = require('../models/referenceDataHistory');
const Product = require('../models/product');

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
  console.log("getReferenceDataById called")
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
    await updateProductTotals(updatedReferenceData);
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
  console.log("Initiating combinedByCategory");
  let formattedData = [];
  ReferenceData.aggregate([
    {
      '$group': {
        '_id': '$category',
        'data': {
          '$push': {
            '_id': '$_id',
            'item': '$item',
            'rate': '$rate',
            'unit': '$unit'
          }
        }
      }
    }
  ])
    .then((combinedData) => {
      console.log("after aggregate in combined Data", combinedData)
      combinedData.forEach(ele => {
        key = ele._id;
        val = ele.data;
        formattedData.push({[key]: val})
      });
      console.log("after formatting in combined Data", formattedData)
      res.json(formattedData);
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

updateProductTotalsWithAggrPipeline = async (updatedData) => {
  try {
 
    db.products.aggregate([
      // Match products that have a matching fiber or fabric nested row
      {
        $match: {
          $or: [
            { "fiber.type": updatedData.item },
            { "fabric.type": updatedData.item }
          ]
        }
      },
      // Add fields to match the fiber and fabric nested rows
      {
        $addFields: {
          fiberMatch: {
            $filter: {
              input: "$fiber",
              as: "fiberRow",
              cond: { $eq: ["$$fiberRow.type", updatedData.item] }
            }
          },
          fabricMatch: {
            $filter: {
              input: "$fabric",
              as: "fabricRow",
              cond: { $eq: ["$$fabricRow.type", updatedData.item] }
            }
          }
        }
      },
      // Update fiber rows with new rate and total
      {
        $addFields: {
          "fiber.$[elem].rate": updatedData.rate,
          "fiber.$[elem].total": { $multiply: ["$fiberMatch.qty", updatedData.rate] }
        },
        arrayFilters: [
          { "elem.type": updatedData.item }
        ]
      },
      // Update fabric rows with new rate and total
      {
        $addFields: {
          "fabric.$[elem].rate": updatedData.rate,
          "fabric.$[elem].total": { $multiply: ["$fabricMatch.qty", updatedData.rate] }
        },
        arrayFilters: [
          { "elem.type": updatedData.item }
        ]
      },
      // Recalculate product total
      {
        $addFields: {
          "totalPrice": {
            $sum: {
              $map: {
                input: "$fiber",
                as: "fiberRow",
                in: "$$fiberRow.total"
              }
            }
          }
        }
      },
      // Other aggregation stages if any
    ]);
    
    console.log('Product totals updated successfully.');
  } catch (error) {
    console.error('Error updating product totals:', error);
  }
}

async function recalculateProductTotalAggr(product) {
  try {
    const updatedProduct = await Product.aggregate([
      {
        $match: { _id: product._id } // Match the specific product
      },
      {
        $lookup: {
          from: 'referenceData', // Assuming your reference data collection name is 'referenceData'
          let: { fabricType: '$fabric.type', fiberType: '$fiber.type' },
          pipeline: [
            {
              $match: {
                $expr: {
                  $or: [
                    { $eq: ['$item', '$$fabricType'] },
                    { $eq: ['$item', '$$fiberType'] }
                  ]
                }
              }
            }
          ],
          as: 'materialData'
        }
      },
      {
        $addFields: {
          fabricData: {
            $filter: {
              input: '$materialData',
              as: 'data',
              cond: { $eq: ['$$data.item', '$fabric.type'] }
            }
          },
          fiberData: {
            $filter: {
              input: '$materialData',
              as: 'data',
              cond: { $eq: ['$$data.item', '$fiber.type'] }
            }
          }
        }
      },
      {
        $project: {
          fabricRate: { $arrayElemAt: ['$fabricData.rate', 0] },
          fiberRate: { $arrayElemAt: ['$fiberData.rate', 0] }
        }
      },
      {
        $set: {
          'fabric.rate': '$fabricRate',
          'fabric.total': { $multiply: ['$fabricRate', '$fabric.qty'] },
          'fiber.rate': '$fiberRate',
          'fiber.total': { $multiply: ['$fiberRate', '$fiber.qty'] }
        }
      },
      {
        $set: {
          totalPrice: { $sum: ['$fabric.total', '$fiber.total'] }
        }
      }
    ]);

    return updatedProduct[0]; // Return the updated product
  } catch (error) {
    console.error('Error recalculating product total:', error);
    return product; // Return the original product object if there's an error
  }
}

async function updateProductTotals(updatedReferenceData) {
  try {
    // Find all products that use the updated reference data
    const productsToUpdate = await Product.find({
      $or: [
        { 'fabric.type': updatedReferenceData.item },
        { 'fiber.type': updatedReferenceData.item }
      ]
    });
    console.log("productsToUpdate", productsToUpdate);
    // Update the product totals based on the updated reference data
    for (const product of productsToUpdate) {
      const updatedProduct = await recalculateProductTotal(product, updatedReferenceData);
      await Product.findByIdAndUpdate(product._id, updatedProduct);
    }
  } catch (error) {
    console.error('Error updating product totals:', error);
  }
}

async function recalculateProductTotal(product, updatedReferenceData) {
  try {
    // Calculate the new total for fabric if it exists in the product
    if (product.fabric) {
      product.fabric.forEach((fabricRow) => {
        if (fabricRow.type === updatedReferenceData.item) {
          fabricRow.rate = updatedReferenceData.rate;
          fabricRow.total = fabricRow.qty * updatedReferenceData.rate;
        }
      });
    }

    // Calculate the new total for fiber if it exists in the product
    if (product.fiber) {
      product.fiber.forEach((fiberRow) => {
        if (fiberRow.type === updatedReferenceData.item) {
          fiberRow.rate = updatedReferenceData.rate;
          fiberRow.total = fiberRow.qty * updatedReferenceData.rate;
        }
      });
    }

    // Recalculate the overall total for the product
    let overallTotal = 0;
    if (product.fabric) {
      product.fabric.forEach((fabricRow) => {
        overallTotal += fabricRow.total;
      });
    }
    if (product.fiber) {
      product.fiber.forEach((fiberRow) => {
        overallTotal += fiberRow.total;
      });
    }

    // Update the overall total in the product
    product.totalPrice = overallTotal;

    return product;
  } catch (error) {
    console.error('Error recalculating product total:', error);
    return product; // Return the original product object if there's an error
  }
}

