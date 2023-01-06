// File used for testing, will populate the database with fake data

// Get arguments passed on command line
var userArgs = process.argv.slice(2);
/*
if (!userArgs[0].startsWith('mongodb')) {
    console.log('ERROR: You need to specify a valid mongodb URL as the first argument');
    return
}
*/
var async = require('async');
var Node = require('../models/node');
var Gateway = require('../models/gateway');
var History = require('../models/history');

var mongoose = require('mongoose');
var mongoDB = userArgs[0];
var toDrop = userArgs[1];

const genRanHex = size => [...Array(size)].map(() => Math.floor(Math.random() * 16).toString(16)).join('');
;
// Connect to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

var db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));


var nodes = [];
var gateways = [];


function nodeCreate(name, lat, lon, online, gID, cb) {
    var nodeDetail = {
        location: {
            latitude: lat,
            longitude: lon
        },
        gatewayID: gID
    };

    if (online != false) nodeDetail.online = online;
    if (name != false) nodeDetail.name = name;

    var node = new Node(nodeDetail);

    node.save(function (err) {
        if (err) {
            cb(err, null)
            return
        }

        nodes.push(node)
        cb(null, node)
    });
}


function gatewayCreate(name, lat, lon, online, cb) {
    var gatewayDetail = {
        location: {
            latitude: lat,
            longitude: lon
        }
    }

    if (online != false) gatewayDetail.online = online;
    if (name != false) gatewayDetail.name = name;

    var gateway = new Gateway(gatewayDetail);

    gateway.save(function (err) {
        if (err) {
            cb(err, null);
            return;
        }

        gateways.push(gateway);
        cb(null, gateway);
    })

}

function createGateways(cb) {
    async.series([
        function (callback) {
            gatewayCreate(undefined, 30.2571366526, 6.3558960615, false, callback);
        },
        function (callback) {
            gatewayCreate(genRanHex(12), -126.3493324891, 4.2383672482, true, callback);
        },
        function (callback) {
            gatewayCreate(genRanHex(12), -15.3696898475, -88.8199694384, true, callback);
        },
        function (callback) {
            gatewayCreate(undefined, -23.2303841167, 22.2861784502, true, callback);
        },
        function (callback) {
            gatewayCreate('allihwlavabli', 114.6292776880, 108.8437651744, true, callback);
        },
        function (callback) {
            gatewayCreate(genRanHex(12), -171.2965592369, -161.0972330537, false, callback);
        },
        function (callback) {
            gatewayCreate('jasdlfsladbflw', -100.7379357417, -93.8841818835, undefined, callback);
        },
        function (callback) {
            gatewayCreate('kafjldsnf', -92.3812054857, -74.4357933689, undefined, callback);
        },
        function (callback) {
            gatewayCreate(genRanHex(12), -1.2608185494, -62.9209832755, false, callback);
        },
        function (callback) {
            gatewayCreate('afjalflwew', -23.6127252775, 153.4604141974, undefined, callback);
        },
    ],

        cb)
}



function createNodes(cb) {
    async.parallel([
        function (callback) {
            nodeCreate(false, -42.4842565816, -177.8025045569, false, gateways[0], callback);
        },
        function (callback) {
            nodeCreate('jjfaslk', -77.7883199487, 10.5188059261, false, gateways[0], callback);
        },
        function (callback) {
            nodeCreate(undefined, -104.7315454332, 25.2889382891, false, gateways[1], callback);
        },
        function (callback) {
            nodeCreate(false, -139.1269469942, -123.8829698134, false, gateways[1], callback);
        },
        function (callback) {
            nodeCreate(false, -74.2780422088, -117.1005575994, false, gateways[3], callback);
        },
        function (callback) {
            nodeCreate(false, -73.4320662117, -0.2883665602, false, gateways[6], callback);
        },
        function (callback) {
            nodeCreate(false, 34.6492823498, 54.5175698082, false, gateways[5], callback);
        },
        function (callback) {
            nodeCreate(false, 125.0075881775, 77.5868295379, false, gateways[9], callback);
        },
        function (callback) {
            nodeCreate(false, -41.4290027103, 5.7902783331, false, gateways[8], callback);
        },
        function (callback) {
            nodeCreate(false, 36.8398429013, -90.6836245029, false, gateways[8], callback);
        }
    ],

        cb)
}


async.series([
    createGateways,
    createNodes,
],
    // Optional callback
    function (err, results) {
        if (err) {
            console.log('FINAL ERR: ' + err);
        }

        // All done, disconnect from database
        mongoose.connection.close();
    });