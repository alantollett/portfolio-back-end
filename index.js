// add the process environment variables
require('dotenv').config();

// dependencies for user authentication
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const crypto = require('crypto');

// import own code from other files/modules...
const Portfolio = require('./Portfolio'); // Portfolio class
const getStockData = require('./StockData'); // getStockData function
const getWeights = require('./Weights'); // getWeights function

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// dependency for allowing cross-origin requests 
const cors = require('cors');
app.use(cors());

// connect to the mysql database
const mysql = require('mysql');
var con = mysql.createConnection({
    host: process.env.MYSQL_HOST,
    user: process.env.MYSQL_USER,
    password: process.env.MYSQL_PASSWORD,
    database: "portfolio"
});
con.connect((err) => {
    if(err) throw err;
    console.log('Connected to the Database...');
});

// setup the email account
const nodemailer = require('nodemailer');
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// helper function for outputting errors
function error(response, error){
    console.log(error);
    response.status(500).send(`Internal Server Error: ${error}`);
}


// default route
app.get('/', async (req, res) => {
    const tickers = ['AAPL', 'TSLA', 'KO', 'NKE', 'MSFT', 'AMZN', 'WFC', 'PEP'];
    const stockData = await getStockData(tickers);
    const weights = getWeights(tickers.length, 0.2);

    const portfolios = [];
    weights.forEach((weights) => portfolios.push(new Portfolio(stockData, weights)));
    res.json(portfolios);
});



/**
 * User System (authentication).
 */
// Register for an account
app.post('/register', async (req, res) => {
    const user = req.body.user;
    user.password = await bcrypt.hash(user.password, 10);

    // check if the user already exists
    con.query('SELECT * FROM user WHERE email=?', [user.email], (err, result) => {
        if(err) return error(res, err);
        if(result.length > 0) return res.status(409).send('User already exists.');

        con.query('INSERT INTO user VALUES (?, ?, ?)', [user.email, user.password, 0], (err, result) => {
            if(err) return error(res, err);

            // Generate verification link and add to database
            var id = crypto.randomBytes(40).toString('hex');
            con.query('INSERT INTO verification VALUES (?, ?)', [user.email, id], (err, result) => {
                if(err) return error(res, err);

                // configure email
                var mailOptions = {
                    from: process.env.EMAIL_USER,
                    to: user.email,
                    subject: 'Potfolio Optimiser: Please verify your account!',
                    html: `
                        <h1>Welcome to Portfolio Optimiser</h1>
                        <p>Please verify your account by clicking the following link:</p>
                        localhost:5000/verify/${id}`
                };
            
                // Send verification email to user
                transporter.sendMail(mailOptions, (err, info) => {
                    if(err) return error(res, err);
                    res.status(201).send();
                });
            });
        });
    });
});

// Verify a users email (user clicks link in the email)
app.get('/verify/:id', (req, res) => {
    // check if the verification id exists
    con.query('SELECT email FROM verification WHERE id=?', [req.params.id], (err, result) => {
        if(err) return error(res, err);
        if(result.length === 0) return res.status(404).send('Verification link does not exist.');

        // verify the user
        con.query('UPDATE user SET verified=1 WHERE email=?', [result[0].email], (err, result) => {
            res.status(201).send('Verified');
        });
    });
});

// Login to an account (and return a Json Web Token (JWT))
app.post('/login', async (req, res) => {
    const user = req.body.user;

    // check if user exists
    con.query('SELECT * FROM user WHERE email=?', [user.email], async (err, result) => {
        if(err) return error(res, err);
        if(result.length === 0) return res.status(404).send(); // not found

        // check if password is correct
        if(! (await bcrypt.compare(user.password, result[0].password))){
            return res.status(401).send(); // unauthorised
        }

        // check if user has verified email
        if(result[0].verified == 0) return res.status(412).send(); // unverified email
        
        // add values from database to user, and remove password so its not sent across the internet
        user['password'] = null;

        // create a JWT with the user object and send back to user.
        res.status(200).json({accessToken: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)});
    });
});

// start the server
app.listen(process.env.PORT, () => console.log(`Listening on port ${process.env.PORT}...`));




















// OLD GET ASSETS CODE WORKING WITH DAILY PRICES RATHER THAN % CHANGE...

    // // create array of asset objects each containing ticker, exp return and standard deviation.
    // var assets = [];
    // for(var key in history){
    //     var asset = {ticker: key};

    //     // expected annual return (average return over the last 10 years).
    //     const currentPrice = history[key][0].adjClose;
    //     const startingPrice = history[key][history[key].length - 1].adjClose;
    //     asset['expectedReturn'] = (currentPrice - startingPrice) / 10;

    //     // mean (average) price
    //     var mean = 0;
    //     for(var i = 0; i < history[key].length; i++){
    //         mean += history[key][i].adjClose;
    //     }
    //     mean /= history[key].length;

    //     // variance (difference from mean)
    //     var variance = 0;
    //     for(var i = 0; i < history[key].length; i++){
    //         variance += ((history[key][i].adjClose - mean) ** 2);
    //     }
    //     variance /= history[key].length - 1; 

    //     // standard deviation
    //     asset['standardDeviation'] = Math.sqrt(variance);

    //     assets.push(asset);
    // }
    // return assets;