// add the process environment variables
require('dotenv').config();

// dependencies for user authentication
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// import own code from other files/modules...
const Portfolio = require('./Portfolio'); // Portfolio class
const getStockData = require('./StockData'); // getStockData function
const getWeights = require('./Weights'); // getWeights function

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// dependency for allowing cross-origin requests 
const cors = require('cors');
app.use(cors());

// connect to the mysql database
const mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "portfolio"
});
con.connect((err) => {
    if(err) throw err;
    console.log('Connected to the Database...');
});

// default route
app.get('/', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN', 'WFC', 'PEP'];
    const stockData = await getStockData(tickers);
    const weights = getWeights(tickers.length, 0.2);

    const portfolios = [];
    weights.forEach((weights) => portfolios.push(new Portfolio(stockData, weights)));
    res.json(portfolios);
});




// start the server
app.listen(5000, () => console.log('Listening on port 5000...'));




















// OLD GET ASSETS CODE WORKING WITH DAILY PRICES RATHER THAN % CHANGE...

    // // create array of asset objects each containing ticker, exp return and standard deviation.
    // var assets = [];
    // for(var key in history){
    //     var asset = {ticker: key};

    //     // expected annual return (average return over the last 10 years).
    //     const currentPrice = history[key][0].adjClose;
    //     const startingPrice = history[key][history[key].length - 1].adjClose;
    //     asset['expectedReturn'] = (currentPrice - startingPrice) / 10;

    //     // mean (average) price
    //     var mean = 0;
    //     for(var i = 0; i < history[key].length; i++){
    //         mean += history[key][i].adjClose;
    //     }
    //     mean /= history[key].length;

    //     // variance (difference from mean)
    //     var variance = 0;
    //     for(var i = 0; i < history[key].length; i++){
    //         variance += ((history[key][i].adjClose - mean) ** 2);
    //     }
    //     variance /= history[key].length - 1; 

    //     // standard deviation
    //     asset['standardDeviation'] = Math.sqrt(variance);

    //     assets.push(asset);
    // }
    // return assets;