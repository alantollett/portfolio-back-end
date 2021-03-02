const yahooFinance = require('yahoo-finance');

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// default route
app.get('/', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'KO'];
    
    const assets = await getStockData(tickers); // each key has an exp return and standard deviation.
    const weights = getWeights(tickers.length, 0.5);

    const portfolios = [];
    weights.forEach((portfolioWeights) => portfolios.push(new Portfolio(assets, portfolioWeights)));

    res.json(portfolios);
});

async function getStockData(tickers){
    // collect historical stock prices from yahooFinance API
    const history = await yahooFinance.historical({
        symbols: tickers,
        from: '2011-01-01',
        to: '2021-01-01'
    });

    // create a 'cleaned' dataset

    var stockData = [];
    for(var key in history){
        var currStock = { ticker: key };

        // calculate expected return for the asset based upon daily % change
        var sumPctChange = 0;
        var pctChanges = [];
        for(var i = 1; i < history[key].length; i++){
            const increase = history[key][i].adjClose - history[key][i-1].adjClose;
            const pctChange = increase / history[key][i-1].adjClose * 100;
            pctChanges.push(pctChange);
            sumPctChange = sumPctChange + pctChange;
        }
        currStock['pctChanges'] = pctChanges;
        currStock['meanDailyChange'] = sumPctChange / pctChanges.length;
        currStock['expectedReturn'] = sumPctChange / 10; // 10 = num years so annual expRet

        // calculate standard deviation of the assets based upon daily % change
        const meanPctChange = sumPctChange / pctChanges.length;
        var variance = 0;
        for(var i = 0; i < pctChanges.length; i++){
            variance += ((pctChanges[i] - meanPctChange) ** 2);
        }
        variance /= pctChanges.length - 1; 
        currStock['standardDeviation'] = Math.sqrt(variance);

        stockData.push(currStock);
    }
    return stockData;
}


class Portfolio {
    constructor(assets, weights){
        this.weights = weights;
        this.expectedReturn = this.calcExpectedReturn(assets);
        this.standardDeviation = this.calcStandardDeviation(assets);
    }

    calcExpectedReturn = (assets) => {
        var expReturn = 0;
        for(var i = 0; i < assets.length; i++){
            expReturn += this.weights[i] * assets[i].expectedReturn;
        }
        return expReturn;
    }

    calcStandardDeviation = (assets) => {
        var sd = 0;
        for(var i = 0; i < assets.length; i++){
            for(var j = 0; j < assets.length; j++){
                var correlationCoefficient = covariance(assets[i], assets[j]) / (assets[i].standardDeviation * assets[j].standardDeviation);

                sd += this.weights[i] * assets[i].standardDeviation 
                    * this.weights[j] * assets[j].standardDeviation 
                    * correlationCoefficient;
            }
        }
        return sd;
    }
}

function covariance(assetI, assetJ){
    var cov = 0;
    for(var i = 0; i < assetI.pctChanges.length; i++){
        cov += (assetI.pctChanges[i] - assetI.meanDailyChange) * (assetJ.pctChanges[i] - assetJ.meanDailyChange);
    }
    cov /= assetI.pctChanges.length - 1;
    return cov;
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