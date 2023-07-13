const express = require('express');
//const router = express.Router();
const bodyParser = require('body-parser');
const cors = require('cors');
const helmet = require('helmet');
const morgan = require('morgan');
const dotenv = require('dotenv');
const routes = require('./routes');
const connectDB = require('./config/database');
const fs = require('fs');
const path = require('path')
const rfs = require('rotating-file-stream') // version 2.x
//const accessLogStream = fs.createWriteStream('./logs/access.log', { flags: 'a' }); //Make sure to create the logs directory beforehand so that the log file can be created.
//const accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })
// create a rotating write stream
const accessLogStream = rfs.createStream('access.log', {
  interval: '1d', // rotate daily
  path: path.join(__dirname, 'logs')
})
// Load environment variables from .env file
dotenv.config();

connectDB();

const app = express();

// Middleware
app.use(bodyParser.json());
app.use(cors({
  origin: [
    //'http://localhost:4200',
    'http://dev.rc.fluffpandastore.com/',
    'https://dev.rc.fluffpandastore.com/',
    'http://rc.fluffpandastore.com/',
    'https://rc.fluffpandastore.com/',
    'http://rc-dev.fluffpandastore.com/',
    'https://rc-dev.fluffpandastore.com/']
}));
app.use(helmet());
//app.use(morgan('combined'));
app.use(morgan('combined', { stream: accessLogStream }));

// Routes
app.use('/', routes);

// Start the server
const port = process.env.PORT || 3000;
app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});


