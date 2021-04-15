require('dotenv').config();
const fs = require('fs');

// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// dependency for allowing cross-origin requests 
const cors = require('cors');
app.use(cors());

// set up express to serve the react app
const path = require('path');
app.use(express.static(path.join(__dirname, 'build')));
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'build', 'index.html'));
});

// import routes
const userManager = require('./Routes/userRoute');
app.use('/user', userManager.router);

const dataRoute = require('./Routes/dataRoute');
app.use('/data', dataRoute);

// set up express to use https (if they key and certificate exists)
if(fs.existsSync('key.key') && fs.existsSync('certificate.cer')){
    const https = require('https');
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
const http = require('http');
http.createServer(app).listen(80, () => console.log(`HTTP Server started on port 80.`));