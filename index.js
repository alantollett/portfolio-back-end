// add the process environment variables
require('dotenv').config();

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// dependency for allowing cross-origin requests 
const cors = require('cors');
app.use(cors());

// import routes
const userManager = require('./Routes/userRoute');
app.use('/user', userManager.router);

const dataRoute = require('./Routes/dataRoute');
app.use('/data', dataRoute);

// start the server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));