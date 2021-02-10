const yahooFinance = require('yahoo-finance');

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// default route
app.get('/', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'ZM'];
    const assets = await getAssets(tickers);
    const weights = getWeights(tickers.length, 0.5);

    const portfolios = [];
    weights.forEach((weight, index) => portfolios.push(new Portfolio(index, assets, weight)));

    res.json(portfolios);
});

async function getAssets(tickers){
    const history = await yahooFinance.historical({
        symbols: tickers,
        from: '2011-01-01',
        to: '2021-01-01',
        preriod: 'm'
    });

    // calculate the expected annual return and add to output object
    var assets = {};
    for(var key in history){
        const currentPrice = history[key][0].adjClose;
        const startingPrice = history[key][history[key].length - 1].adjClose;
        assets[key] = (currentPrice - startingPrice) / 10;
    }

    return assets;
}

class Portfolio {
    constructor(id, assets, weights){
        this.id = id;
        this.weights = weights;
        this.expectedReturn = this.calcExpectedReturn(assets);
        //this.setStandardDeviation();
    }

    calcExpectedReturn = (assets) => {
        var expReturn = 0;
        for(var i = 0; i < Object.keys(assets).length; i++){
            expReturn += this.weights[i] * assets[Object.keys(assets)[i]];
        }
        return expReturn;
    }
}

/**
 * Generates an list of different weights that can be used to generate different porfolios.
 * @param {number} n the number of assets.
 * @param {number} stepSize how big the jump between different weights should be, e.g. for 2 assets and a step size of 5 you would get [[100, 0], [95, 5], [90, 10], ...].
 * @return {Array} a list of weights based upon the n and the stepSize.
 */
function getWeights(n, stepSize){
    var weights = [];

    // start with 100% of the first asset
    var currWeights = new Array(n).fill(0);
    currWeights[0] = 1;
    weights.push(currWeights);

    // call recursive helper function with a copy of the starting weights
    weightsAux(weights, currWeights.slice(), stepSize);
    
    // remove duplicates and return.
    var set = new Set(weights.map(JSON.stringify));
    return Array.from(set).map(JSON.parse);
}

/**
 * (recursive) Helper function for the weights function.
 * @param {Array} weights the list of weights to be returned.
 * @param {Array} currWeights the current weights being edited.
 * @param {number} stepSize how big the jump between different weights should be.
 */
function weightsAux(weights, currWeights, stepSize){
    if(currWeights[0] - stepSize < 0) return;

    // remove stepSize from the first asset
    currWeights[0] = currWeights[0] - stepSize;

    for(var i = 1; i < currWeights.length; i++){
        // add stepSize to one of the other assets
        currWeights[i] = currWeights[i] + stepSize;
        weights.push(currWeights.slice());

        // recurse on the new set of weights then backtrack before next iteration.
        weightsAux(weights, currWeights.slice(), stepSize);
        currWeights[i] = currWeights[i] - stepSize;
    }
}

// start the server
app.listen(5000, () => console.log('Listening on port 5000...'));