const userManager = require('./userRoute');
const fs = require('fs');
const path = require('path');

// importing the database connection func from database.js
const getDatabaseConnection = require('../database');

// dependency for getting 'live' stock/portfolio data
const dataCollector = require('../Data/dataCollector');

// dependencies for setting up express route
const express = require('express');
const router = express.Router();

// middleware for logging connections to end points in this file
router.use((req, res, next) => {
    console.log(`${new Date()} ${req.ip} made a ${req.method} request to ${req.protocol}://${req.get('host') + req.originalUrl}.`);
    next();
});

/**
 * Generates and returns a list of portfolios, each with a different weighting
 * applied to each of the portfolios listed in the tickers variable of this file.
 * @response {JSON} a json object containing a list of portfolio objects.
 */
router.get('/portfolios', userManager.authenticateToken, async (req, res) => {
    var tickers = req.query.tickers.split('-');
    var portfolios = await dataCollector.getPortfolios(tickers);
    portfolios.forEach(portfolio => delete portfolio["stocks"]);
    res.json(portfolios);
});

router.get('/companies', async (req, res) => {
    // load tickers from the sp500.json file
    var companies = [];
    var filePath = path.resolve(__dirname, '../Data/sp500.json');
    console.log(filePath);

    if(fs.existsSync(filePath)){
        companies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    res.json(companies);    
});

module.exports = router