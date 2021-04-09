const Stock = require('./Stock');
const Portfolio = require('./Portfolio');
const getWeights = require('./weights');

// load all tickers from s&p500 then filter by price-book value on a yFinance quote
const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN', 'RIO'];
const weights = getWeights(tickers.length, 0.2);
var stocks = [];
var portfolios = [];

// updates the stock list
async function updateStocks(){
    stocks = [];
    for(ticker of tickers){
        stocks.push(new Stock(ticker));
        await stocks[stocks.length - 1].init();
    }
}

// updates the portfolio list
async function updatePortfolios(){
    portfolios = [];
    for(weight of weights){
        portfolios.push(new Portfolio(stocks, weight));
        await portfolios[portfolios.length - 1].init();
    }
}

// set stocks and then portfolios upon start-up
updateStocks().then(async () => {
    await updatePortfolios();
    console.log(`Loaded ${stocks.length} Stock(s) and ${portfolios.length} portfolios.`);
});

// and then update them both every 30 second(s)...
setInterval(async () => {
    await updateStocks();
    await updatePortfolios();
    console.log(`Loaded ${stocks.length} Stock(s) and ${portfolios.length} portfolios.`);
}, 60000);

module.exports = {
    getStocks: () => {return stocks},
    getPortfolios: () => {return portfolios},
}