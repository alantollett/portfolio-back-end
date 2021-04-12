const userManager = require('../user');

// importing the database connection func from database.js
const getDatabaseConnection = require('../../database');

// dependency for getting 'live' stock/portfolio data
const data = require('./dataCollector');

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
    var portfolios = await data.getPortfolios(tickers);
    portfolios.forEach(portfolio => {
        delete portfolio["stocks"];
    });
    res.json(portfolios);
});

/**
 * Generates and returns a list of stock objects
 * @response {JSON} a json object containing a list of stock objects.
 */
router.get('/investments', userManager.authenticateToken, async (req, res) => {
    // connect to the database
    const con = getDatabaseConnection();

    // get the tickers for investments held by the user
    var investments = await con.query('SELECT ticker, numShares FROM investment WHERE email=?', [req.user]);
    con.close();

    const tickers = investments.map(row => row.ticker);
    const shares = investments.map(row => row.numShares);

    // get a list of Stock objects from the tickers
    var stocks = await data.getStocks(tickers);
    stocks.forEach((stock, index) => {
        delete stock["pctChanges"];
        delete stock["avgDailyReturn"];
        stock["numShares"] = shares[index];
    });

    res.json(stocks);
});

module.exports = router