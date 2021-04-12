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

    const tickers = investments.map(row => row.ticker);
    const shares = investments.map(row => row.numShares);

    // get a list of Stock objects from the tickers
    var stocks = await data.getStocks(tickers);
    stocks.forEach((stock, index) => {
        delete stock["pctChanges"];
        delete stock["avgDailyReturn"];
        stock["numShares"] = shares[index];
    });

    con.close();
    res.json(stocks);
});

router.post('/investments', userManager.authenticateToken, async (req, res) => {
    const email = req.user;
    const investment = req.body.investment;
    const ticker = investment.ticker;
    const numShares = parseInt(investment.numShares);

    // connect to the database
    const con = getDatabaseConnection();

    // get the investments already held by the user
    var investments = await con.query('SELECT ticker, numShares FROM investment WHERE email=? AND ticker=?', [email, ticker]);

    // check if the action is a purchase (+ve) or sell (-ve)
    if(numShares > 0){
        // purchase
        if(investments.length === 0){
            // if user doesn't already own shares in company then add a new entry
            await con.query('INSERT INTO investment VALUES (?, ?, ?)', [email, ticker, numShares]);
            res.status(201).send();
        } else{
            // otherwise add to existing entry
            const existingInvestment = investments[0];
            const newNumShares = existingInvestment.numShares + numShares;
            await con.query('UPDATE investment SET numShares=? WHERE email=? AND ticker=?', [newNumShares, email, ticker]);
            res.status(202).send();
        }
    }else{
        // sell
        if(investments.length === 0 || investments[0].numShares - numShares < 0){
            // if user doesn't own enough shares in the company then error...
            res.status(412).send();
        }else if(investments[0].numShares + numShares === 0){
            // otherwise if new num shares is zero then delete
            await con.query('DELETE FROM investment WHERE email=? AND ticker=?', [email, ticker]);
            res.status(202).send();
        }else{
            // otherwise just change existing investment
            const newNumShares = investments[0].numShares + numShares;
            await con.query('UPDATE investment SET numShares=? WHERE email=? AND ticker=?', [newNumShares, email, ticker]);
            res.status(202).send();
        }
    }

    con.close();
});

module.exports = router