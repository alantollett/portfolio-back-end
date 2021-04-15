const fs = require('fs');
const path = require('path');

/**
 * Generates an list of different weights that can be used to generate different porfolios.
 * @param {number} n the number of assets.
 * @param {number} stepSize how big the jump between different weights should be, e.g. for 2 assets and a step size of 5 you would get [[100, 0], [95, 5], [90, 10], ...].
 * @return {Array} a list of weights based upon the n and the stepSize.
 */
function getWeights(n, stepSize){
    var recursiveCalls = [];
    var weights = [];

    // start with 100% of the first asset
    var currWeights = new Array(n).fill(0);
    currWeights[0] = 100;
    weights.push(currWeights);

    // call recursive helper function with a copy of the starting weights
    weightsAux(weights, currWeights.slice(), stepSize, recursiveCalls);
    
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

/**
 * Loads weights from a file if generated before, otherwise generates weights
 * and stores them to a file for use the next time the program runs.
 * @param {number} n the max number of assets in a portfolio.
 * @param {number} stepSize how big the jump between different weights should be, 
 * e.g. for 2 assets and a step size of 5 you would get [[100, 0], [95, 5], [90, 10], ...].
 * @return {Array} a list of weights based upon the n and the stepSize.
 */
function loadWeights(maxStocksInPortfolio, stepSize){
    var weights = [];

    // load weights from the weights.json file if it already exists
    var filePath = path.resolve(__dirname, './weights.json');
    if(fs.existsSync(filePath)){
        console.log(`Loaded weights from ${filePath}...`);
        const file = JSON.parse(fs.readFileSync(filePath, 'utf8'));
        weights = file;
        return weights;
    }

    // othewrwise just load weights...
    console.log('Loading weights...');
    for(var i = 1; i < maxStocksInPortfolio + 1; i++){
        weights.push(getWeights(i, stepSize));
        console.log('Loaded weights for i = ' + i + '.');
    }

    // store to file so that this only needs to be done once
    fs.writeFileSync(filePath, JSON.stringify(weights));
    console.log(`Loaded all weights successfully and stored in ${filePath}.`);

    return weights;
}

var maxStocksInPortfolio = 5;
const stepSize = 10;
var allWeights = loadWeights(maxStocksInPortfolio, stepSize);

module.exports = allWeights;