/*
    Generates sample data on mongoDB connection.
    Note: ## This code replaces the "test" database  ##
    
    The code generates the network within a "circle".
    Gateway locations are generated to be near the perimeter of the "circle".
    Node locations are generated randomly within the "circle".
    History data is generated randomly. 
    History time is generated in steps, ending at the current time. i.e. [1:30, 2:00, 2:30...];
    - Some variance is applied to each step, i.e, (TIME_STEP - TIME_STEP_VAR) < step < (TIME_STEP + TIME_STEP_VAR).
    Below specifies the meanings of the configurations (constants):
    - RANGE => radius of circle, in degrees
    - CNTR => center of the circle, in degrees
    - GATEWAYS => number of gateways
    - NODES => number of nodes
    - HISTORIES => Number of history entries per node.
    - TIME_STEP => Minutes per step in history entry.
    - TIME_STEP_VAR => The variance of each step, in minutes.
*/


const async = require('async');
const Node = require('../models/node');
const History = require('../models/History');

let mongoose = require('mongoose');

require('dotenv').config({ path: "./config.env" });
let mongoDB = process.env.DATABASE_URI;

// Connect to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




const RANGE = 0.3; // In degrees (~ 69 miles)
const CNTR = [37.512, -121.882]; // MISSION PEAK @ CALIFORNIA
const GATEWAYS = 6;
const NODES = 20;
const HISTORIES = 3;
const TIME_STEP = 30;
const TIME_STEP_VAR = 10;
const ADJ_DIST = 0.01;

const gatewayIDs = [];
const nodeIDs = [];


function randRange (a, b) {
	return Math.abs(a - b) * Math.random() + Math.min(a, b);
}

const crash = (err) => {
    console.error("Error: ", err);
    mongoose.connection.close();
    process.exit(1);
};

const genNodes = () => {
	const list = [];

	for (let i=0; i<NODES; i++) {

		const a = Math.random() * 360;
		const r = Math.random() * RANGE; 
		const lon = Math.sin(a) * r;
		const lat = Math.cos(a) * r;

        const id = 1000 + i+1;
        nodeIDs[i] = id;

		const o = {
			_id: id,
			location: {
				longitude: CNTR[1] + lon,
				latitude: CNTR[0] + lat
			},
            gateway: false,
		};
		console.log(`(${o.location.longitude}, ${o.location.latitude})`);
		list.push( cb => {
            const n = new Node(o);
            n.save(e => e ? crash(e) : cb());
        });
	}
	return list;
}

const genGateways = () => {
	const list = [];

	for (let i=0; i<GATEWAYS; i++) {

		const a = Math.random() * 360;
		const r = RANGE + randRange(-3, 3) / 69; 
		const lon = Math.sin(a) * r;
		const lat = Math.cos(a) * r;

        const id = 2000 + i+1;
        gatewayIDs[i] = id;

		const o = {
			_id: id,
			location: {
				longitude: CNTR[1] + lon,
				latitude: CNTR[0] + lat
			},
            gateway: true,
		};
		console.log(`(${o.location.longitude}, ${o.location.latitude})`);
        list.push(cb => { 
            const g = new Node(o);
            g.save(e => e ? crash(e) : cb());
        });
	}
	return list;
}

const genAdj = async () => {
    const nodes = await Node.find()
        .sort([['_id', 'ascending']]);

    const dist = (a, b) => {
        const dlon = a.location.longitude - b.location.longitude;
        const dlat = a.location.latitude - b.location.latitude;
        return dlon * dlon + dlat * dlat;
    }

    for (let i=0; i<nodes.length; i++) {
        for (let j=i+1; j<nodes.length; j++) {
            if (nodes[i].gateway && nodes[j].gateway) continue;
            if (dist(nodes[i], nodes[j]) < ADJ_DIST) {
                nodes[i].adjacencies.push(nodes[j]._id);
                nodes[j].adjacencies.push(nodes[i]._id);
            }
        }
    }
    const list = [];
    for (let i=0; i<nodes.length; i++) 
        await nodes[i].save();
    
    return list;
}

const genHistory = () => {
	const list = [];
	for (let i=0; i<NODES; i++) {
		let t = Date.now();
		for (let j=0; j<HISTORIES; j++) {
			t = t - (TIME_STEP + randRange(-TIME_STEP_VAR, TIME_STEP_VAR)) * 60;
            
            const o = {
                srcID: nodeIDs[i],
                packetID: HISTORIES - j,
                temp: randRange(40, 80),
                humidity: randRange(20, 70),
                smokeLevel: randRange(10, 200),
            };
            list.push( cb => {
                const h = new History(o);
                h.save(e => e ? crash(e) : cb());
            });
		}
	}
    return list;
}

async function run () {
    await Node.collection.drop();
    await History.collection.drop();
    await async.parallel(genNodes());
    await async.parallel(genGateways());
    await genAdj();
    await async.parallel(genHistory());

    console.log("Done");
    process.exit(0);
}

run();