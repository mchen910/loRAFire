// File used for testing, will populate the database with fake data

// Get arguments passed on command line
var userArgs = process.argv.slice(2);

var async = require('async');
var Node = require('../models/node');
var Gateway = require('../models/gateway');
var History = require('../models/history');

var mongoose = require('mongoose');

require('dotenv').config();
var mongoDB = process.env.DATABASE_URI;

// Connect to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var nodes = [];
var gateways = [];


function nodeCreate(lat, lon, lastPing, cb) {
    var nodeDetail = {
        _id: Math.floor(Math.random() * 10000),
        location: {
            latitude: lat,
            longitude: lon
        },
        lastPing: lastPing,
    };

    var node = new Node(nodeDetail);
    node.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }
        console.log(node);
        nodes.push(node)
        cb(null, node)
    });
}


function gatewayCreate(lat, lon, lastPing, cb) {
    var gatewayDetail = {
        _id: Math.floor(Math.random() * 10000),
        location: {
            latitude: lat,
            longitude: lon
        },
        lastPing: lastPing
    };

    console.log(gatewayDetail);
    var gateway = new Gateway(gatewayDetail);

    gateway.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        console.log(gateway);
        gateways.push(gateway);
        cb(null, gateway);
    })

}

function createGateways(cb) {
    async.series([
        (callback) => gatewayCreate(30.2571366526, 6.3558960615, now-100, callback),
        (callback) => gatewayCreate(-126.3493324891, 4.2383672482, now-301, callback),
        (callback) => gatewayCreate(-15.3696898475, -88.8199694384, now-1, callback),
        /*
        (callback) => gatewayCreate(-23.2303841167, 22.2861784502, now-45, callback),
        (callback) => gatewayCreate(114.6292776880, 108.8437651744, now, callback),
        (callback) => gatewayCreate(-171.2965592369, -161.0972330537, now, callback),
        (callback) => gatewayCreate(-100.7379357417, -93.8841818835, now, callback),
        (callback) => gatewayCreate(-92.3812054857, -74.4357933689, now-102201, callback),
        (callback) => gatewayCreate(-1.2608185494, -62.9209832755, now-1203, callback),
        (callback) => gatewayCreate(-23.6127252775, 153.4604141974, now, callback)
         */
    ],
        cb)
};


const now = Date.now();
function createNodes(cb) {
    async.parallel([
        (callback) => nodeCreate(-42.4842565816, -177.8025045569, now, callback),
        (callback) => nodeCreate(-139.1269469942, -123.8829698134, now - 10000, callback),
        (callback) => nodeCreate(-74.2780422088, -117.1005575994, now-800, callback),
        /*
        (callback) => nodeCreate(-73.4320662117, -0.2883665602, now-90000, gateways[6], callback),
        (callback) => nodeCreate(34.6492823498, 54.5175698082, now-100, gateways[5], callback),
        (callback) => nodeCreate(-77.7883199487, 10.5188059261, now, gateways[0], callback),
        (callback) => nodeCreate(104.7315454332, 25.2889382891, now, gateways[1], callback)
        (callback) => nodeCreate(125.0075881775, 77.5868295379, now-1, gateways[9], callback),
        (callback) => nodeCreate(-41.4290027103, 5.7902783331, now, gateways[8], callback),
        (callback) => nodeCreate(36.8398429013, -90.6836245029, now, gateways[8], callback)
         */
    ],
        cb)
};

async.series(
    [
        createGateways,
        createNodes,
    ],
    (err, results) => {
        if (err) 
            console.log('FINAL ERR: ' + err);
        
        mongoose.connection.close();
    }
);