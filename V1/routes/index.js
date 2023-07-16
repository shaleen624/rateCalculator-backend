const express = require('express');
const router = express.Router();
const referenceDataRouter = require('./referenceData');
const referenceDataHistoryRouter = require('./referenceDataHistory');
const productFieldsRoutes = require('./productFieldsRoutes');
const productRouter = require('./productRoute');
const authRoutes = require('./auth.js');

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
router.use('/auth', authRoutes);


module.exports = router;
