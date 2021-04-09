// dependency for getting 'live' stock/portfolio data
const data = require('./dataCollector');

// dependencies for setting up express route
const express = require('express');
const router = express.Router();

// middleware for logging connections to end points in this file
router.use((req, res, next) => {
    // console.log(`${new Date()} ${req.ip} made a ${req.method} request to ${req.protocol}://${req.get('host') + req.originalUrl}.`);
    next();
});

/**
 * Generates and returns a list of portfolios, each with a different weighting
 * applied to each of the portfolios listed in the tickers variable of this file.
 * @response {JSON} a json object containing a list of portfolio objects.
 */
router.get('/portfolios', async (req, res) => {
    res.json(data.getPortfolios());
});

/**
 * Generates and returns a list of stock objects
 * @response {JSON} a json object containing a list of stock objects.
 */
 router.get('/stocks', async (req, res) => {
    res.json(data.getStocks());
});
























// app.get('/prices', async (req, res) => {
//     yahooFinance.quote({
//         symbols: tickers,
//         from: '2016-01-01',
//     }).then(prices => {
//         res.json(prices);
//     });
// });

module.exports = router