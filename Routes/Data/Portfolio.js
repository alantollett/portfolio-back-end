var Portfolio = class Portfolio {
    constructor(stocks, weights){
        this.tickers = stocks.map(stock => stock.ticker);
        this.weights = weights;
        this.expectedReturn = this.calcExpectedReturn(stocks);
        this.standardDeviation = this.calcStandardDeviation(stocks);
        this.expectedDividendYield = this.calcExpectedDividendYield(stocks);
        this.asString = this.toString();
    }

    calcExpectedDividendYield = (stocks) => {
        var expDivYield = 0;
        for(var i = 0; i < stocks.length; i++){
            expDivYield += this.weights[i] * stocks[i].expectedDividendYield;
        }
        return expDivYield;
    }

    calcExpectedReturn = (stocks) => {
        var expReturn = 0;
        for(var i = 0; i < stocks.length; i++){
            expReturn += this.weights[i] * stocks[i].expectedReturn;
        }
        return expReturn;
    }

    calcStandardDeviation = (stocks) => {
        var sd = 0;
        for(var i = 0; i < stocks.length; i++){
            for(var j = 0; j < stocks.length; j++){
                var correlationCoefficient = covariance(stocks[i], stocks[j]) / (stocks[i].standardDeviation * stocks[j].standardDeviation);

                sd += this.weights[i] * stocks[i].standardDeviation 
                    * this.weights[j] * stocks[j].standardDeviation 
                    * correlationCoefficient;
            }
        }
        return sd;
    }

    toString = () => {
        var output = "";
        for(var i = 0; i < this.tickers.length; i++){
            output += this.tickers[i] + ": " + (this.weights[i] * 100) + "%<br>";
        }
        return output;
    }
}

function covariance(assetI, assetJ){
    var cov = 0;
    for(var i = 0; i < assetI.pctChanges.length; i++){
        cov += (assetI.pctChanges[i] - assetI.avgDailyReturn) * (assetJ.pctChanges[i] - assetJ.avgDailyReturn);
    }
    cov /= assetI.pctChanges.length - 1;
    return cov;
}

module.exports = Portfolio;