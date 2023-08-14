const express = require('express');
const router = express.Router();

const ReferenceDataHistory = require('../referenceDataHistory');

// Get reference data history by date range and pagination
router.get('/', (req, res) => {
  const { startDate, endDate, page, pageSize } = req.query;

  const query = {};

  if (startDate && endDate) {
    query.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const options = {
    skip: parseInt(page) * parseInt(pageSize),
    limit: parseInt(pageSize),
  };

  const responseData = {};

  ReferenceDataHistory.find(query, {}, options)
    //.sort({ createdAt: -1 }) // Sort by createdAt in descending order (latest first)
    .then((data) => {
      responseData.items = data;

      return ReferenceDataHistory.countDocuments(query);
    })
    .then((count) => {
      responseData.totalRecords = count;
      res.json(responseData);
    })
    .catch((error) => {
      console.error('Error while getting reference data history', error);
      res.status(500).json({ error: 'Error while getting reference data history' });
    });
});
// Get reference data history by date range and pagination only data
router.get('/onlyData', (req, res) => {
  const { startDate, endDate, page, pageSize } = req.query;

  const query = {};

  if (startDate && endDate) {
    query.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  const options = {
    skip: parseInt(page) * parseInt(pageSize),
    limit: parseInt(pageSize),
  };

  ReferenceDataHistory.find(query, {}, options)
    .then((data) => {
      res.json(data);
    })
    .catch((error) => {
      console.error('Error while getting reference data history', error);
      res.status(500).json({ error: 'Error while getting reference data history' });
    });
});

// Get total number of reference data history records
router.get('/total-records', (req, res) => {
  const { startDate, endDate } = req.query;

  const query = {};

  if (startDate && endDate) {
    query.timestamp = {
      $gte: new Date(startDate),
      $lte: new Date(endDate),
    };
  }

  ReferenceDataHistory.countDocuments(query)
    .then((count) => {
      res.json({ count });
    })
    .catch((error) => {
      console.error('Error while getting total number of reference data history records', error);
      res.status(500).json({ error: 'Error while getting total number of reference data history records' });
    });
});

module.exports = router;
