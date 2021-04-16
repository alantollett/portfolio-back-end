const fs = require('fs');
const path = require('path');
const express = require('express');
const userManager = require('./user');
const dataCollector = require('../Data/dataCollector');

// create a route for this file
const router = express.Router();

/**
 * Generates and returns a list of portfolios, each with a different weighting
 * applied to each of the portfolios listed in the tickers variable of this file.
 * @response {JSON} a json object containing a list of portfolio objects.
 */
router.get('/portfolios', userManager.authenticateToken, async (req, res) => {
    // ensure the user has provided a list of tickers
    if(!req.query || ! req.query.tickers){
        return res.status(400).send('You must provide a - delimited list of tickers.');
    }

    // get a list of portfolios consisting of the tickers
    var tickers = req.query.tickers.split('-');
    var portfolios = await dataCollector.getPortfolios(tickers);

    // remove the 'stock' object from the portfolio
    // in order to make response more lightweight
    portfolios.forEach(portfolio => delete portfolio["stocks"]);
    
    res.json(portfolios);
});

/**
 * Generates and returns a list of portfolios, each with a different weighting
 * applied to each of the portfolios listed in the tickers variable of this file.
 * @response {JSON} a json object containing a list of portfolio objects.
 */
 router.get('/portfolios2d', userManager.authenticateToken, async (req, res) => {
    // ensure the user has provided a list of tickers
    if(!req.query || ! req.query.tickers){
        return res.status(400).send('You must provide a - delimited list of tickers.');
    }
    
    // get a list of portfolios consisting of the tickers
    var tickers = req.query.tickers.split('-');
    var portfolios = await dataCollector.getPortfolios2d(tickers, req.query.riskWeighting, req.query.returnWeighting);

    // remove the 'stock' object from the portfolio
    // in order to make response more lightweight
    portfolios.forEach(portfolio => delete portfolio["stocks"]);
    
    res.json(portfolios);
});

/**
 * Generates and returns a list of companies (name, ticker, sector)
 * from a file that are to be usable by the app.
 * @response {JSON} a JSON object containing a list of companies
 */
router.get('/companies', async (req, res) => {
    // load tickers from the sp500.json file
    var companies = [];
    var filePath = path.resolve(__dirname, '../Data/sp500.json');
    
    if(fs.existsSync(filePath)){
        companies = JSON.parse(fs.readFileSync(filePath, 'utf8'));
    }

    res.json(companies);    
});

module.exports = router