const Stock = require('../Classes/Stock');
const Portfolio = require('../Classes/Portfolio');
const weights = require('./weightsGenerator');

/**
 * Gets a list of stock objects for the specified tickers.
 * @param {*} tickers the tickers you want stock objects for
 * @returns a list of stock objects
 */
async function getStocks(tickers){
    var stocks = [];
    for(ticker of tickers){
        stocks.push(new Stock(ticker));
        await stocks[stocks.length - 1].init();
    }
    return stocks;
}

/**
 * Gets a list of portfolio objects, each with a different 
 * weighting assigned to each of the specified tickers.
 * @param {*} tickers the tickers you want the portfolios to contain
 * @returns a list of portfolio objects
 */
async function getPortfolios(tickers){
    var weightings = await weights[tickers.length - 1];
    var stocks = await getStocks(tickers);

    var portfolios = [];
    for(weight of weightings){
        portfolios.push(new Portfolio(stocks, weight));
        await portfolios[portfolios.length - 1].init();
    }

    // adds an extra 'efficient' attribute to optimal portfolios
    optimisePortfolios(portfolios);
    return portfolios;
}

/**
 * Determines if a portfolio (optimisationally) dominates another portfolio.
 * (i.e. p1 is equal to or better than p2 in expRet, stanDev and divYield, 
 * and strictly better than in at least one of the three).
 * @param {*} p1 the first portfolio
 * @param {*} p2 the second portfolio
 * @returns true if p1 'dominates' p2, false otherwise. 
 */
function dominates(p1, p2){
    const betterOrSameInAll = (p1.expectedReturn >= p2.expectedReturn)
                           && (p1.expectedDividendYield >= p2.expectedDividendYield)
                           && (p1.standardDeviation <= p2.standardDeviation);

    const betterInAtLeastOne = (p1.expectedReturn > p2.expectedReturn)
                           || (p1.expectedDividendYield > p2.expectedDividendYield)
                           || (p1.standardDeviation < p2.standardDeviation);
    
    return betterOrSameInAll && betterInAtLeastOne;
}

/**
 * Adds an efficient attribute to each portfolio which is
 * true if the portfolio is 'optimal', otherwise false.
 * @param {*} portfolios a list of portfolios
 */
async function optimisePortfolios(portfolios){
    for(var p1 of portfolios){
        var efficient = true;
        for(var p2 of portfolios){
            if(p1.weights !== p2.weights && dominates(p2, p1)){
                efficient = false;
                break;
            }
        }

        p1['efficient'] = efficient;
    }
}


async function getPortfolios2d(tickers, riskWeighting, returnWeighting){
    var weightings = await weights[tickers.length - 1];
    var stocks = await getStocks(tickers);

    var portfolios = [];
    for(weight of weightings){
        portfolios.push(new Portfolio(stocks, weight));
        await portfolios[portfolios.length - 1].init();
    }

    // adds an extra 'efficient' attribute to optimal portfolios
    optimisePortfolios2d(portfolios, riskWeighting, returnWeighting);
    return portfolios;
}

/**
 * Adds an efficient attribute to each portfolio which is
 * true if the portfolio is 'optimal', otherwise false.
 * @param {*} portfolios a list of portfolios
 */
 async function optimisePortfolios2d(portfolios, riskWeighting, returnWeighting){
    for(var p1 of portfolios){
        var efficient = true;
        for(var p2 of portfolios){
            if(p1.weights !== p2.weights && dominates2d(p2, p1, riskWeighting, returnWeighting)){
                efficient = false;
                break;
            }
        }

        p1['efficient'] = efficient;
    }
}

function dominates2d(p1, p2, riskWeighting, returnWeighting){
    const riskP1 = (p1.standardDeviation * riskWeighting) + (p1.priceToBook * (1 - riskWeighting));
    const returnP1 = (p1.expectedReturn * returnWeighting) + (p1.expectedDividendYield * (1 - returnWeighting));
    const riskP2 = (p2.standardDeviation * riskWeighting) + (p2.priceToBook * (1 - riskWeighting));
    const returnP2 = (p2.expectedReturn * returnWeighting) + (p2.expectedDividendYield * (1 - returnWeighting));

    const betterOrSameInAll = (returnP1 >= returnP2) && (riskP1 <= riskP2);
    const betterInAtLeastOne =  (returnP1 >= returnP2) || (riskP1 <= riskP2);
    
    return betterOrSameInAll && betterInAtLeastOne;
}

module.exports = {
    getStocks: getStocks,
    getPortfolios: getPortfolios,
    getPortfolios2d: getPortfolios2d
}