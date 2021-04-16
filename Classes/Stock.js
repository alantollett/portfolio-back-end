// dependencies for generating 'live' stock objects
const yahooFinance = require('yahoo-finance');

var Stock = class Stock {
    constructor(ticker){
        this.ticker = ticker;
    }

    init = async () => {
        // collect historical data for stock from yahooFinance API
        const history = await yahooFinance.historical({
            symbol: this.ticker,
            from: '2020-01-01'
        });
        
        // then calculate expected return and standard deviation
        await loadRiskAndReturn(this, history);

        // collect current data for stock from yahooFinance API
        const quote = await yahooFinance.quote({symbol: this.ticker});
        this.sharePrice = Number(quote.price.regularMarketPrice).toFixed(2);
        this.name = quote.price.longName;
        this.priceToBook = quote.defaultKeyStatistics ? quote.defaultKeyStatistics.priceToBook : null;
        const divYield = quote.summaryDetail.fiveYearAvgDividendYield;
        this.expectedDividendYield = divYield ? divYield : 0;
    }
}

loadRiskAndReturn = async (stock, history) => {
    // sum all of the pct changes
    var sumPctChange = 0;
    var pctChanges = [];
    for(var i = history.length - 1; i > 0; i--){
        const increase = history[i-1].adjClose - history[i].adjClose;
        const pctChange = increase / history[i].adjClose * 100;
        sumPctChange = sumPctChange + pctChange;
        pctChanges.push(pctChange);
    }

    // add returns info to stock as required for calculating portfolio s.d
    stock.pctChanges = pctChanges;
    stock.avgDailyReturn = sumPctChange / history.length;

    // calculate annual expected pct change (return)
    const avgNumTradingDays = 253;
    stock.expectedReturn = Number(stock.avgDailyReturn * avgNumTradingDays).toFixed(2);

    // calculate standard deviation (risk)
    const meanPctChange = sumPctChange / pctChanges.length;
    var variance = 0;
    for(var i = 0; i < pctChanges.length; i++){
        variance += ((pctChanges[i] - meanPctChange) ** 2);
    }
    variance /= pctChanges.length - 1; 
    stock.standardDeviation = Number(Math.sqrt(variance)).toFixed(2);
}

module.exports = Stock;