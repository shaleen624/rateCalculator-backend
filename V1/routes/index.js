const express = require('express');
const router = express.Router();
const referenceDataRouter = require('./referenceData');
const referenceDataHistoryRouter = require('./referenceDataHistory');
const productFieldsRoutes = require('./productFieldsRoutes');
const productRouter = require('./productRoute')

// Root route
router.get('/', (req, res) => {
  res.send('Hello, World!');
});

router.get('/abc', (req, res) => {
  res.send('Hello, World!');
});

// Reference Data routes
router.use('/reference-data', referenceDataRouter);
router.use('/reference-data-history', referenceDataHistoryRouter);
router.use('/products', productRouter);
router.use('/product-fields', productFieldsRoutes);


module.exports = router;
