// add the process environment variables
require('dotenv').config();

const yahooFinance = require('yahoo-finance');


// import own code from other files/modules...
const Portfolio = require('./Portfolio'); // Portfolio class
const getStockData = require('./StockData'); // getStockData function
const getWeights = require('./Weights'); // getWeights function
// const optimise = require('./Optimiser'); // optimise function

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// dependency for allowing cross-origin requests 
const cors = require('cors');
app.use(cors());

// import routes
const userRoute = require('./Routes/user');
app.use('/user', userRoute);

// get connection from mysql database
const con = require('./database');



// helper function for outputting errors
function error(response, error){
    console.log(error);
    response.status(500).send(`Internal Server Error: ${error}`);
}


// default route
app.get('/', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN'];
    const stockData = await getStockData(tickers);
    const weights = getWeights(tickers.length, 0.25);

    const portfolios = [];
    weights.forEach((weights) => portfolios.push(new Portfolio(stockData, tickers, weights)));
    res.json(portfolios);
});

app.get('/prices', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN'];
    yahooFinance.quote({
        symbols: tickers,
        from: '2016-01-01',
    }).then(prices => {
        res.json(prices);
    });
});

// app.post('/investment', authenticateToken, async (req, res) => {
//     if(!req.user) return res.status(401).send('Please login.');

//     const user = req.user;
//     const ticker = req.body.investment.ticker;
//     const numShares = req.body.investment.numShares;
//     const purchase = req.body.investment.purchase;

//     con.query('SELECT numShares FROM investment WHERE email=? AND ticker=?', [user.email, ticker], (err, investments) => {
//         if(err) return error(res, err);

//         if(investments.length == 0 && purchase){
//             con.query('INSERT INTO investment VALUES (?, ?, ?)', [user.email, ticker, numShares], () => {
//                 res.status(201).send();
//             });
//         } else {
//             if(investments.length == 0 && !purchase){
//                 return res.status(412).send();
//             }

//             var newNumShares = investments[0].numShares;
//             if(purchase) {
//                 newNumShares += numShares;
//             }else {
//                 newNumShares -= numShares;
//             }

//             if(newNumShares < 0){
//                 res.status(412).send();
//             }else if(newNumShares == 0){
//                 con.query('DELETE FROM investment WHERE email=? AND ticker=?', [user.email, ticker], () => {
//                     res.status(202).send();
//                 });
//             } else {
//                 con.query('UPDATE investment SET numShares=? WHERE email=? AND ticker=?', [newNumShares, user.email, ticker], () => {
//                     res.status(202).send();
//                 });
//             }

//         }
//     });
// });








// start the server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));

// every minute, update the user-worth table
// setInterval(() => {
//     const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN'];
//     yahooFinance.quote({
//         symbols: tickers,
//         from: '2016-01-01',
//     }).then(prices => {
//         con.query('SELECT * FROM user', (err, users) => {
//             if(err) console.log(err);

//             for(var i = 0; i < users.length; i++){
//                 const user = users[i];

//                 con.query('SELECT * FROM investment WHERE email=?', [user.email], (err, investments) => {
//                     if(err) return error(res, err);
    
//                     var worth = 0;
//                     for(var investment of investments){
//                         const currentPrice = prices[investment.ticker].price.regularMarketPrice;
//                         worth += investment.numShares * currentPrice;
//                     }

//                     con.query('INSERT INTO worth VALUES (?, ?, ?)', [user.email, new Date(), worth.toFixed(2)]);
//                 });
//             }
//         });
//     });
// }, 15000);
