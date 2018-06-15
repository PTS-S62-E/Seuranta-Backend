import express from 'express';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import request from 'request';

const fs = require('fs');

import submissionRoutes from './routes/submissions';

const app = express();

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Routes
app.use('/api/submissions', submissionRoutes);

// Starts server
server.listen(port, function () {
    console.log('Server starter on port ' + port + '...');

    setInterval(function () {
        request.get()


        fs.appendFile('status.log', 'Hello content!\n', function (err) {
            if(err) throw err;

            console.log('Saved');
        });
    }, 10*1000);
});