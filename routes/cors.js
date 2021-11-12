const express = require('express');
const cors = require('cors');
const app = express();

const whitelist = [
    'http://localhost:3000',
    'https://localhost:3443'
]
var corsOptionsDelegate = (req, callback) => {
    var corsOptions;

    if (whitelist.indexOf(req.header('Origin')) !== -1) {
        corsOptions = { origin: true };
    }
    else {
        corsOptions = { origin: false };
    }
    callback(null, corsOptions);
};

//cors with no options means that any origin with the wild cards are accepted
exports.cors = cors();

//cors with options delegate means that you want to specify specific routes
exports.corsWithOptions = cors(corsOptionsDelegate);