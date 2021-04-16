var Portfolio = class Portfolio {
    constructor(stocks, weights){
        this.tickers = stocks.map(stock => stock.ticker);
        this.weights = weights.map(weight => weight / 100);
        this.stocks = stocks;
    }

    init = async () => {
        await loadValues(this);
    }
}

loadValues = async (portfolio) => {
    const stocks = portfolio.stocks;
    portfolio.expectedReturn = 0;
    portfolio.expectedDividendYield = 0;
    portfolio.standardDeviation = 0;
    portfolio.priceToBook = 0;

    for(var i = 0; i < stocks.length; i++){
        portfolio.expectedReturn += portfolio.weights[i] * stocks[i].expectedReturn;
        portfolio.expectedDividendYield += portfolio.weights[i] * stocks[i].expectedDividendYield;

        if(stocks[i].priceToBook){
            portfolio.priceToBook += portfolio.weights[i] * stocks[i].priceToBook;
        }else {
            const sp500MeanPriceToBook = 2.87;
            portfolio.priceToBook += portfolio.weights[i] * sp500MeanPriceToBook;
        }

        for(var j = 0; j < stocks.length; j++){
            var cov = await covariance(stocks[i], stocks[j]);
            var correlationCoefficient = cov / (stocks[i].standardDeviation * stocks[j].standardDeviation);

            portfolio.standardDeviation += portfolio.weights[i] * stocks[i].standardDeviation 
            * portfolio.weights[j] * stocks[j].standardDeviation 
            * correlationCoefficient;
        }
    }

    portfolio.expectedReturn = Number(portfolio.expectedReturn).toFixed(2);
    portfolio.standardDeviation = Number(portfolio.standardDeviation).toFixed(2);
    portfolio.expectedDividendYield = Number(portfolio.expectedDividendYield).toFixed(2);

    portfolio.asString = '';        
    for(var i = 0; i < portfolio.tickers.length; i++){
        portfolio.asString += portfolio.tickers[i] + ": " + (portfolio.weights[i] * 100) + "%<br>";
    }
}

covariance = async (assetI, assetJ) => {
    var cov = 0;
    for(var i = 0; i < assetI.pctChanges.length; i++){
        cov += (assetI.pctChanges[i] - assetI.avgDailyReturn) * (assetJ.pctChanges[i] - assetJ.avgDailyReturn);
    }
    cov /= assetI.pctChanges.length - 1;
    return cov;
}

module.exports = Portfolio;