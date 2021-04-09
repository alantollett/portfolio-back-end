const Stock = require('./Stock');
const Portfolio = require('./Portfolio');
const getWeights = require('./weights');

// load all tickers from s&p500 then filter by price-book value on a yFinance quote
const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN', 'RIO'];
var stocks;
var portfolios;

const weights = getWeights(tickers.length, 0.15);

// updates the stock list
async function updateStocks(){
    stocks = [];
    for(ticker of tickers){
        stocks.push(new Stock(ticker));
        await stocks[stocks.length - 1].init();
    }
}

// updates the portfolio list
function updatePortfolios(){
    portfolios = [];
    for(weight of weights){
        portfolios.push(new Portfolio(stocks, weights));
    }
}

// set stocks and then portfolios upon start-up
updateStocks().then(() => {
    updatePortfolios();    
    console.log(`Loaded ${stocks.length} Stock(s) and ${portfolios.length} portfolios.`);
});

// and then update them both every 30 second(s)...
setInterval(async () => {
    await updateStocks();
    updatePortfolios();
    console.log(`Loaded ${stocks.length} Stock(s) and ${portfolios.length} portfolios.`);
}, 30000);


module.exports = {
    stocks: stocks,
    portfolios: portfolios,
};