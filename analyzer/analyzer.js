const Node = require("../models/node");
const History = require("../models/history");
const _async = require('async');

/*
    Function to be called on "History" PUT to re-assess the network.
*/
const ADJ_DIST = 0.01;
let visited = [];

async function flood (id) {
    visited.push(id);
    console.log("processing node: ", id);

    const node = await Node.findById(id);

    const dist = (a) => {
        const dlon = node.location.longitude - a.location.longitude;
        const dlat = node.location.latitude - a.location.latitude;
        return dlon * dlon + dlat * dlat;
    }
    // Get Neighbor Data
    const nodes = [];
    {
        for (let i=0; i<node.adjacencies.length; i++) {
            await Node.findById(node.adjacencies[i]).then( (node, err) => {
                if (err) {
                    throw err;
                } else { 
                    nodes.push({v: node, dist: dist(node)});
                }
            });
        }
    }

    // Analyze using ^
    // This "changed" criterion must be defined, i.e. "how much does the analysis result have to change 
    //   to necessitate propagation & recaclulation of it's neighboring node's risk?"
    let changed = false; 

    // Dummy processor, get the average temp from each node, weighted by their distance from the node.
    {
        let cnt = 0;
        let riskLvl = 0;
        // Get self dat
        {
            const data = await History.findById(node.latestPacketID);

            if (data) {    
                riskLvl += data.temp;
                cnt ++;
            }
        }
        for (let i=0; i<nodes.length; i++) {
            const data = await History.findById(nodes[i].v.latestPacketID);

            if (!data) continue; 
            riskLvl += data.temp * nodes[i].dist;
            cnt ++;
        }
        if (cnt != 0)
            riskLvl /= cnt ++;
    
        node.analysis.riskLvl = riskLvl;
        changed = true;

        console.log("output level: ", riskLvl);
    }

    // If analysis result changed, DFS to nodes within a certain distance. (propogation)
    if (changed) {
        for (let i=0; i<nodes.length; i++) {
            if (visited.includes(nodes[i].v._id)) continue;
            if (nodes[i].v.gateway) continue;

            if (nodes[i].dist < ADJ_DIST) {
                flood(nodes[i].v._id);
            }
        }
    }
}

exports.process = async (id) => {
    visited = [];
    flood(id);
}