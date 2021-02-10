const yahooFinance = require('yahoo-finance');

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// default route
app.get('/', async (req, res) => {

    // get historical stock prices for some companies
    const history = await yahooFinance.historical({
        symbols: ['AAPL', 'TSLA', 'MSFT', 'AMZN', 'ZM'],
        from: '2020-01-01',
        to: '2021-01-01',
        preriod: 'm'
    });

    // // calculate the expected annual return and add to output object
    // var output = {};
    // for(var key in history){
    //     const currentPrice = history[key][0].adjClose;
    //     const startingPrice = history[key][history.AAPL.length - 1].adjClose;

    //     output[key] = {
    //         symbol: key,
    //         expectedReturn: currentPrice - startingPrice,
    //     };
    // }

    // return the processed data
    // res.json(output);

    res.send(weights(3, 25));
});


class Car {
    constructor(name, year) {
      this.name = name;
      this.year = year;
    }
    age(x) {
      return x - this.year;
    }
}

// n = number of assets, stepSize influences number of portfolios generated
function weights(n, stepSize){
    var weights = [];

    // start with 100% of the first asset
    var currWeights = new Array(n).fill(0);
    currWeights[0] = 100;
    weights.push(currWeights);

    // call recursive helper function with a copy of the starting weights
    // (must be a copy otherwise the original weights will be edited too)
    weightsAux(weights, currWeights.slice(), stepSize);
    
    var set = new Set(weights.map(JSON.stringify));
    return Array.from(set).map(JSON.parse);
}

function weightsAux(weights, currWeights, stepSize){
    // base case: stop recursing when we cannot subtract stepSize from the first asset
    if(currWeights[0] - stepSize < 0) return;

    // remove stepSize from the first asset
    currWeights[0] = currWeights[0] - stepSize;

    // for each of the other assets
    for(var i = 1; i < currWeights.length; i++){
        // create a new set of weights by adding step size to one of the assets only
        currWeights[i] = currWeights[i] + stepSize;

        // add a clone of the updated weights to the weights array
        weights.push(currWeights.slice());

        // recurse on the new set of assets
        weightsAux(weights, currWeights.slice(), stepSize);

        // back track (undo changes to current asset before next iteration of the for loop)
        currWeights[i] = currWeights[i] - stepSize;
    }
}

// start the server
app.listen(5000, () => console.log('Listening on port 5000...'));