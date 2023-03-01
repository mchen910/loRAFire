const async = require('async');
const Node = require('../models/node');
const History = require('../models/History');

let mongoose = require('mongoose');

require('dotenv').config();
let mongoDB = process.env.DATABASE_URI;

// Connect to the database
mongoose.connect(mongoDB, { useNewUrlParser: true, useUnifiedTopology: true });
mongoose.Promise = global.Promise;

let db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB connection error:'));




const RANGE = 0.3;
//const CNTR = [37.512, -121.882];
const CNTR = [0, 0];
const GATEWAYS = 6;
const NODES = 20;
const HISTORIES = 3;

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
				longitude: CNTR[0] + lon,
				latitude: CNTR[1] + lat
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
				longitude: CNTR[0] + lon,
				latitude: CNTR[1] + lat
			}
		};
		console.log(`(${o.location.longitude}, ${o.location.latitude})`);
		list.push( cb => {
            const n = new Node(o);
            n.save(e => e ? crash(e) : cb());
        });
	}
	return list;
}

const genHistory = () => {
	const list = [];
	for (let i=0; i<NODES; i++) {
		let t = Date.now();
		for (let j=0; j<HISTORIES; j++) {
			t = t - (30 + randRange(-10, 10)) * 60;
            
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
    await async.parallel(genGateways());
    await async.parallel(genNodes());
    await async.parallel(genHistory());

    console.log("Done");
    process.exit(0);
}

run();