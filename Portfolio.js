var Portfolio = class Portfolio {
    constructor(stocks, weights){
        this.weights = weights;
        this.expectedReturn = this.calcExpectedReturn(stocks);
        this.standardDeviation = this.calcStandardDeviation(stocks);
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