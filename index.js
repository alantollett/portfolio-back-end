// setup the express app 
const express = require('express');
const app = express();
app.use(express.json());

// default route
app.get('/', (req, res) => {
    res.send('Hello, World!');
});

// start the server
app.listen(5000, () => console.log('Listening on port 5000...'));