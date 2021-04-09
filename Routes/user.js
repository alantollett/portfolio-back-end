// dependencies for user authentication
const crypto = require('crypto');
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');

// dependencies for setting up express route
const express = require('express');
const router = express.Router();

// dependencies for setting up the email account
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

// importing the database connection func from database.js
const getDatabaseConnection = require('../database');

// middleware for logging connections to end points in this file
router.use((req, res, next) => {
    console.log(`${new Date()} ${req.ip} made a ${req.method} request to ${req.protocol}://${req.get('host') + req.originalUrl}.`);
    next();
});


/**
 * Adds a new user to the back-end database with a specified email, and 
 * sends an email to the user with a verification link.
 * @response {HTTP Code} 409 if a user already exists with the email address.
 * @response {HTTP Code} 201 if the user was added to the database successfully.
 */
router.post('/register', async (req, res) => {
    // connect to the database
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
                http://localhost:80/user/verify/${id}`
        };
        await transporter.sendMail(mailOptions);

        // user was added wit no errors, so respond with http code 201
        res.status(201).send();
    } catch(err) {
        console.log(err);
    } finally {
        await con.close();
    }
})

/**
 * Verifies a new user's email.
 * @param {number} id the unique id assigned to the email. 
 * @response {HTTP Code} 404 if the id specified was invalid.
 * @response {HTTP Code} 201 if the email was verified successfully.
 */
router.get('/verify/:id', async (req, res) => {
    // connect to the database
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
        console.log(err);
    } finally {
        await con.close();
    }
});


/**
 * Creates and returns a JSON Web Token based upon a user object created from
 * information stored in the back-end database if the specified email&pass match.
 * @response {HTTP Code} 404 if no user exists with the email address.
 * @response {HTTP Code} 401 if the password provided was incorrect.
 * @response {HTTP Code} 412 if the email hasn't been verified yet.
 * @response {JSON} a json object containing a JWT based upon the user.
 */
router.post('/login', async (req, res) => {
    // connect to the database
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
        user['investments'] = await con.query('SELECT ticker, numShares FROM investment WHERE email=?', [user.email]);
        user['worths'] = await con.query('SELECT date, amount FROM worth WHERE email=?', [user.email]);

        // create a JWT from the user object and send back to user.
        res.status(200).json({accessToken: jwt.sign(user, process.env.ACCESS_TOKEN_SECRET)});
    } catch(err) {
        console.log(err);
    } finally {
        await con.close();
    }
});

// // function called upon every request for user data to
// // ensure that the user is authenticated with the server.
// function authenticateToken(req, res, next){
//     // get the token and return if undefined.
//     const token = req.headers['authorization'] && req.headers['authorization'].split(' ')[1];
//     // const token = req.body.token;
//     if(!token) return res.status(401).send('No JWT provided.');

//     // check if the token is valid and add the user to the request of the calling function.
//     jwt.verify(token, process.env.ACCESS_TOKEN_SECRET, (err, user) => {
//         if(err) return res.status(401).send('JWT is not valid.');
//         req.user = user;
//         next();
//     });
// }

module.exports = router