const yahooFinance = require('yahoo-finance');

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

module.exports = getStockData;