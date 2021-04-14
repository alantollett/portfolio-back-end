const Stock = require('../Classes/Stock');
const Portfolio = require('../Classes/Portfolio');
const weights = require('./weightsGenerator');

async function getStocks(tickers){
    var stocks = [];
    for(ticker of tickers){
        stocks.push(new Stock(ticker));
        await stocks[stocks.length - 1].init();
    }
    return stocks;
}

async function getPortfolios(tickers){
    var weightings = await weights[tickers.length - 1];
    var stocks = await getStocks(tickers);

    var portfolios = [];
    for(weight of weightings){
        portfolios.push(new Portfolio(stocks, weight));
        await portfolios[portfolios.length - 1].init();
    }

    optimisePortfolios(portfolios);

    return portfolios;
}

function dominates(p1, p2){
    const betterOrSameInAll = (p1.expectedReturn >= p2.expectedReturn)
                           && (p1.expectedDividendYield >= p2.expectedDividendYield)
                           && (p1.standardDeviation <= p2.standardDeviation);

    const betterInAtLeastOne = (p1.expectedReturn > p2.expectedReturn)
                           || (p1.expectedDividendYield > p2.expectedDividendYield)
                           || (p1.standardDeviation < p2.standardDeviation);
    
    return betterOrSameInAll && betterInAtLeastOne;
}

async function optimisePortfolios(portfolios){
    for(var p1 of portfolios){
        var efficient = true;
        for(var p2 of portfolios){
            if(p1.weights !== p2.weights && dominates(p2, p1)){
                efficient = false;
                break;
            }
        }

        // if(efficient) console.log('efficient');
        p1['efficient'] = efficient;
    }
}

module.exports = {
    getStocks: getStocks,
    getPortfolios: getPortfolios,
}