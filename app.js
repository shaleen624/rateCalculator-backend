const express = require('express');
//const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const connectDB = require('./config/database');


// Load environment variables from .env file
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: 'http://localhost:4200'
}));
app.use(helmet());
app.use(morgan('combined'));

// Routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


