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
    return portfolios;
}

module.exports = {
    getStocks: getStocks,
    getPortfolios: getPortfolios,
}