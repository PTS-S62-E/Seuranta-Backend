import express from 'express';
import bodyParser from 'body-parser';
import 'babel-polyfill';
import request from 'request';
import path from 'path';

const fs = require('fs');

const app = express();

app.use(function (request, response, next) {
    response.header("Access-Control-Allow-Origin", "*");
    response.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
    next();
});

const server = require('http').createServer(app);
const port = process.env.PORT || 3000;
const pollingTime = process.env.POLLINGTIME || 15 * 60 * 1000;

// Body Parser Middleware
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({extended: false}));

// Set Static Path
app.use(express.static(path.join(__dirname, 'public')));

// Starts server
server.listen(port, function () {
    console.log('Server starter on port ' + port + '...');

    pollServices();

    setInterval(pollServices, pollingTime);
});

function pollServices() {
    request.get('http://192.168.24.100:8082/Politie-Backend/api/status/',
        function (error, response, body) {
            const currentTime = new Date();
            const status = (response.statusCode === 200) ? 'RUNNING' : 'DOWN';

            fs.appendFile('lib/public/status.log', `${currentTime}|POLITIE-BACKEND|${status}\n`, function (err) {
                if (err) throw err;
            });
        });


    request.get('http://192.168.24.100:8082/rekening-administratie/api/status/',
        function (error, response, body) {
            const currentTime = new Date();
            const status = (response.statusCode === 200) ? 'RUNNING' : 'DOWN';

            fs.appendFile('lib/public/status.log', `${currentTime}|REKENING-ADMINISTRATIE|${status}\n`, function (err) {
                if (err) throw err;
            });
        });


    request.get('http://192.168.24.100:8082/registratie-verplaatsing/api/status/',
        function (error, response, body) {
            const currentTime = new Date();
            const status = (response.statusCode === 200) ? 'RUNNING' : 'DOWN';

            fs.appendFile('lib/public/status.log', `${currentTime}|REGISTRATIE-VERPLAATSING|${status}\n`, function (err) {
                if (err) throw err;
            });
        });
}