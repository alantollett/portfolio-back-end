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
 * @response {HTTP Code} 404 if the id specified was invalid.
 * @response {HTTP Code} 201 if the email was verified successfully.
 */
router.get('/portfolios', async (req, res) => {
    console.log(data.stocks);
    // const weights = getWeights(tickers.length, 0.25);
    // const stockData = await getStockData(tickers);

    // const portfolios = [];
    // weights.forEach((weights) => portfolios.push(new Portfolio(stockData, tickers, weights)));
    // res.json(portfolios);
    res.status(200).send();
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