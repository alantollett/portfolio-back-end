// dependencies for user authentication
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
const express = require('express');

const dataCollector = require('../Data/dataCollector');
const getDatabaseConnection = require('../database');
const Stock = require('../Classes/Stock');

// create a route for this file
const router = express.Router();

// connect to the email server
var transporter = nodemailer.createTransport({
    host: process.env.EMAIL_HOST,
    port: 587,
    secure: false,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD
    }
});

// every minute, update the user-worth table
setInterval(async () => {
    const con = getDatabaseConnection();

    try {
        const emails = await con.query('SELECT email FROM user WHERE verified=1');
        for(var email of emails){
            const investments = await con.query('SELECT ticker, numShares FROM investment WHERE email=?', [email.email]);
            var worth = 0;
            for(var investment of investments){
                var stock = new Stock(investment.ticker);
                await stock.init();
                worth += stock.sharePrice * investment.numShares;
            }
            await con.query('INSERT INTO worth VALUES (?, ?, ?)', [email.email, new Date(), worth.toFixed(2)]);
        }
        console.log('Sucessfully updated user worths table.');
    } catch(err) {
        console.log(err);
    } finally {
        await con.close();
    }
}, 60000);


/**
 * A middleware function to be called upon any request for sensitive data,
 * i.e. data that should require a user to be authenticated (e.g. investments, portfolios...).
 * @returns calls the next function in the request loop if the user is authenticated, otherwise error.
 */
function authenticateToken(req, res, next){
    // get the token and return if undefined.
    const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
    if(!token) return res.status(401).send('No JWT provided.');

    // check if the token is valid and add the user to the request of the calling function.
    jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
        if(err) return res.status(401).send('JWT is not valid.');
        req.user = user;
        next();
    });
}


/**
 * Register a new user with a specified email and password.
 * @response {HTTP Code} 409 if a user already exists with the email address.
 * @response {HTTP Code} 201 if the user was added to the database successfully.
 */
router.post('/register', async (req, res, next) => {
    const con = getDatabaseConnection();
    
    try{ 
        // replace user's password with hashed version
        const user = req.body.user;
        user.password = await bcrypt.hash(user.password, 10);
    
        // check if the user already exists
        const users = await con.query('SELECT * FROM user WHERE email=?', [user.email]);
        if(users.length > 0) return res.status(409).send('User already exists.');
    
        // if not, then insert user (email, pass, verified) into database
        await con.query('INSERT INTO user VALUES (?, ?, ?)', [user.email, user.password, 0]);
    
        // generate a verification id and add to database
        const id = crypto.randomBytes(40).toString('hex');
        await con.query('INSERT INTO verification VALUES (?, ?)', [user.email, id]);
    
        // send an email to the user with a verification link
        const mailOptions = {
            from: process.env.EMAIL_USER,
            to: user.email,
            subject: 'Potfolio Optimiser: Please verify your account!',
            html: `
                <h1>Welcome to Portfolio Optimiser</h1>
                <p>Please verify your account by clicking the following link:</p>
                ${process.env.API_PATH}/user/verify/${id}`
        };
        await transporter.sendMail(mailOptions);

        // user was added wit no errors, so respond with http code 201
        res.status(201).send();
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
})

/**
 * Verifies a user's email.
 * @param {number} id the unique id assigned to the email. 
 * @response {HTTP Code} 404 if the id specified was invalid.
 * @response {HTTP Code} 201 if the email was verified successfully.
 */
router.get('/verify/:id', async (req, res, next) => {
    const con = getDatabaseConnection();
    
    try{    
        // check if the verification id exists
        const results = await con.query('SELECT email FROM verification WHERE id=?', [req.params.id]);
        if(results.length === 1){
            // verify the user
            await con.query('UPDATE user SET verified=1 WHERE email=?', [results[0].email]);
            res.status(201).send('Verified');
        }else {
            // alert of error
            res.status(404).send('Verification link does not exist.');
        }
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
});


/**
 * Login a user and return a jwt with user data.
 * @response {HTTP Code} 404 if no user exists with the email address.
 * @response {HTTP Code} 401 if the password provided was incorrect.
 * @response {HTTP Code} 412 if the email hasn't been verified yet.
 * @response {JSON} a json object containing a JWT based upon the user.
 */
router.post('/login', async (req, res, next) => {
    const con = getDatabaseConnection();

    try{  
        const user = req.body.user;

        // return if no user with the same email exists
        const users = await con.query('SELECT * FROM user WHERE email=?', [user.email]);
        if(users.length === 0) return res.status(404).send();

        // return if no if password does not match
        if(! (await bcrypt.compare(user.password, users[0].password))){
            return res.status(401).send(); // unauthorised
        }

        // return if user hasn't verified their email
        if(users[0].verified == 0) return res.status(412).send();

        // user is valid, so add data to the user object
        user['password'] = null;

        // create a JWT from the user object and send back to user.
        res.status(200).json({
            fullAccessToken: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET),
            shortAccessToken: jwt.sign(user.email, process.env.ACCESS_TOKEN_SECRET)
        });
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
});

/**
 * Gets a list of investments held by the user
 * @response {JSON} a json object containing a list of stock objects.
 */
 router.get('/investments', authenticateToken, async (req, res, next) => {
    const con = getDatabaseConnection();

    try {
        // get the tickers for investments held by the user
        var investments = await con.query('SELECT ticker, numShares FROM investment WHERE email=?', [req.user]);
        const tickers = investments.map(row => row.ticker);
        const shares = investments.map(row => row.numShares);

        // get a list of Stock objects from the tickers
        var stocks = await dataCollector.getStocks(tickers);
        stocks.forEach((stock, index) => {
            delete stock["pctChanges"];
            delete stock["avgDailyReturn"];
            stock["numShares"] = shares[index];
        });

        // send back as a json object to the user
        res.json(stocks);
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
});

/**
 * Takes a JSON object representing an investment (ticker, numShares) and updates the db accordingly.
 * @response {HTTP Code} 406 if the user tries to sell a share they do not own.
 * @response {HTTP Code} 202 if the investment was purchased/sold successfully.
 */
router.post('/investments', authenticateToken, async (req, res, next) => {
    const email = req.user;
    const investment = req.body.investment;
    const ticker = investment.ticker;
    const numShares = parseInt(investment.numShares);
    const con = getDatabaseConnection();

    try{
        // get the investments already held by the user
        var investments = await con.query('SELECT ticker, numShares FROM investment WHERE email=? AND ticker=?', [email, ticker]);

        // check if the user already has an investment in this ticker
        if(investments.length === 0){
            // no existing investment
            if(numShares <= 0) {
                return res.status(406).send('You cannot sell shares in companies which you do not own.');
            } else {
                await con.query('INSERT INTO investment VALUES (?, ?, ?)', [email, ticker, numShares]);
                res.status(202).send();
            }
        }else{
            // already invested, so increment
            const newNumShares = investments[0].numShares + numShares;

            // num shares could be negative in case of sell, so check if 0 and delete
            if(newNumShares <= 0){
                await con.query('DELETE FROM investment WHERE email=? AND ticker=?', [email, ticker]);
                res.status(202).send();
            }else {
                await con.query('UPDATE investment SET numShares=? WHERE email=? AND ticker=?', [newNumShares, email, ticker]);
                res.status(202).send();
            }
        }
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
});

/**
 * Generates and returns a list of worth objects representing the total 
 * value of investments held by the user over time
 * @response {JSON} a json object containing a list of worths.
 */
 router.get('/worths', authenticateToken, async (req, res, next) => {
    const con = getDatabaseConnection();

    try {
        const worths = await con.query('SELECT date, amount FROM worth WHERE email=?', [req.user]);
        res.json(worths);
    } catch(err) {
        next(err);
    } finally {
        await con.close();
    }
});

module.exports = {
    router: router,
    authenticateToken: authenticateToken
};