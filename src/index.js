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
        request.get('http://192.168.24.100:8082/Politie-Backend/api/status/',
            function (error, response, body) {
                const currentTime = new Date();
                const status = (response.statusCode === 200) ? 'RUNNING' : 'DOWN';

                fs.appendFile('status.log', `${currentTime}|POLITIE-BACKEND|${status}\n`, function (err) {
                    if (err) throw err;
                });
            });


        request.get('http://192.168.24.100:8082/rekening-administratie/api/status/',
            function (error, response, body) {
                const currentTime = new Date();
                const status = (response.statusCode === 200) ? 'RUNNING' : 'DOWN';

                fs.appendFile('status.log', `${currentTime}|REKENING-ADMINISTRATIE|${status}\n`, function (err) {
                    if (err) throw err;
                });
            });

    }, 15 * 60 * 1000);
});