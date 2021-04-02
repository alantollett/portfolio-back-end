var Portfolio = class Portfolio {
    constructor(stockData, tickers, weights){
        this.tickers = tickers;
        this.weights = weights;
        this.expectedReturn = this.calcExpectedReturn(stockData);
        this.standardDeviation = this.calcStandardDeviation(stockData);
    }

    calcExpectedReturn = (assets) => {
        var expReturn = 0;
        for(var i = 0; i < assets.length; i++){
            expReturn += this.weights[i] * assets[i].expectedReturn;
        }
        return expReturn;
    }

    calcStandardDeviation = (assets) => {
        var sd = 0;
        for(var i = 0; i < assets.length; i++){
            for(var j = 0; j < assets.length; j++){
                var correlationCoefficient = covariance(assets[i], assets[j]) / (assets[i].standardDeviation * assets[j].standardDeviation);

                sd += this.weights[i] * assets[i].standardDeviation 
                    * this.weights[j] * assets[j].standardDeviation 
                    * correlationCoefficient;
            }
        }
        return sd;
    }

    toString = () => {
        var output = "";
        for(var i = 0; i < this.tickers.length; i++){
            output += this.tickers[i] + ": " + this.weights[i];
        }
        return output;
    }
}

function covariance(assetI, assetJ){
    var cov = 0;
    for(var i = 0; i < assetI.pctChanges.length; i++){
        cov += (assetI.pctChanges[i] - assetI.meanDailyChange) * (assetJ.pctChanges[i] - assetJ.meanDailyChange);
    }
    cov /= assetI.pctChanges.length - 1;
    return cov;
}

module.exports = Portfolio;