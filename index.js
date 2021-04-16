require('dotenv').config();
const fs = require('fs');
const path = require('path');
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const https = require('https');
const http = require('http');

const userManager = require('./Routes/user');
const dataRoute = require('./Routes/data');

// setup express app and add middleware for 
const app = express();
app.use(express.json());
app.use(cors());
app.use(helmet())

// serve the react app at the default route
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    const reactApp = path.join(__dirname, 'build', 'index.html');
    res.sendFile(reactApp);
});

// serve the error page at /error
app.get('/error', (req, res) => {
    res.sendFile(path.join(__dirname, 'error.html'));
});

// import other (api) routes
app.use('/user', userManager.router);
app.use('/data', dataRoute);

// add custom error handling middleware at the end of the req loop
app.use((err, req, res, next) => {
    // if a response started to send and then an error occurs,
    // then just pass on to the default err handler to close connection.
    if(res.headersSent) return next(err);
    console.error(err);

    // output the error to a log file
    var errorStream = fs.createWriteStream('./errors.txt', {flags: 'a'});
    const d = new Date();
    errorStream.write(
        `${new Date()} ${req.ip} ${req.method} ${req.protocol}://${req.get('host') + req.originalUrl}.
        ${err.stack}\n\n`
    );
    
    // redirect the user to a html error page
    res.redirect('/error');
});

// finally set up express to use https (if they key and certificate exists)
if(fs.existsSync('key.key') && fs.existsSync('certificate.cer')){
    const credentials = {
        key: fs.readFileSync('key.key'),
        cert: fs.readFileSync('certificate.cer')
    }
    
    https.createServer(credentials, app).listen(443, () => {
        console.log(`HTTPS Server started on port 443.`);
    });
}else{
    console.log(`HTTPS Server failed to start (no key or certificate).`)
}

// also allow for http connections
http.createServer(app).listen(80, () => console.log(`HTTP Server started on port 80.`));