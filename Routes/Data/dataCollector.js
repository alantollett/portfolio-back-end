const fs = require('fs');
const path = require('path');

const yahooFinance = require('yahoo-finance');
const Stock = require('./Stock');
const Portfolio = require('./Portfolio');
const getWeights = require('./weights');
const { quote } = require('yahoo-finance');

var tickers = [];
var weights = [];
var stocks = [];
var portfolios = [];

// get a list of tickers of stocks to be used by the app...
async function updateTickers(){
    // check if a tickers file already exists
    if(fs.existsSync(path.resolve(__dirname, './tickers.json'))){
        const file = JSON.parse(fs.readFileSync(path.resolve(__dirname, './tickers.json'), 'utf8'));
        const updateDate = new Date(file.updateDate);

        // return if tickers have already been generated this week...
        if(updateDate > new Date()){
            tickers = file.tickers;
            console.log('Tickers loaded from file...');
            return;
        } 
    }

    console.log('Loading tickers...');

    // current date is past the update date, so re-generate tickers.json
    // load all tickers (Symbols) of companies from the s&p500
    const sp500 = JSON.parse(fs.readFileSync(path.resolve(__dirname, './sp500.json'), 'utf8'));
    var companies = sp500.map(company => company.Symbol);

    // load into tickers those with a price-book ratio <= 1.5...
    tickers = [];
    for(ticker of companies){
        const quote = await yahooFinance.quote({
            symbol: ticker, 
            modules: ['price', 'defaultKeyStatistics']
        });

        if(!quote.defaultKeyStatistics || !quote.defaultKeyStatistics.priceToBook) continue;
        if(quote.defaultKeyStatistics.priceToBook <= 1.5) tickers.push(ticker);
    }

    // output tickers to file so that this func is only ran once a week
    var date = new Date();
    date.setDate(date.getDate() + 7);
    fs.writeFileSync(path.resolve(__dirname, './tickers.json'), JSON.stringify({
        updateDate: date,
        tickers: tickers
    }));

    console.log('Tickers stored in /Routes/Data/tickers.json. Next update in 1w.');
}

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

// filter the tickers and then load initial stocks/portfolios
updateTickers().then(async () => {
    weights = getWeights(tickers.length, 0.5);
    await updateStocks();
    await updatePortfolios();
    console.log(`Loaded ${stocks.length} Stock(s) and Generated ${portfolios.length} portfolios.`);
})

// and then update the stocks and portfolios every 30 second(s)...
// setInterval(async () => {
//     await updateStocks();
//     await updatePortfolios();
//     console.log(`Loaded ${stocks.length} Stock(s) and ${portfolios.length} portfolios.`);
// }, 60000);

module.exports = {
    getStocks: () => {return stocks},
    getPortfolios: () => {return portfolios},
}