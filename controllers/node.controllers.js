require('dotenv').config();
const Model = require('../model/node')

// Post Method
const postNode = async (req, res) => {
    const data = new Model({
        nodeID: req.body.nodeID,
        time: req.body.time,
        location: {
            latitude: req.body.location.latitude,
            longitude: req.body.location.longitude,
        },
        batteryLevel: req.body.batteryLevel,
        gatewayID: req.body.gatewayID,
        hSensorID: req.body.hSensorID,
        sSensorID: req.body.sSensorID
    })

    try {
        const dataToSave = await data.save();
        res.status(200).json(dataToSave)
    }
    catch (error) {
        res.status(400).json({message: error.message})
    }
}

// // Get all Method
// router.get('/getAll', (req, res) => {
//     res.send('Get All API')
// })

// // Get by ID Method
// router.get('/getOne/:id', (req, res) => {
//     res.send('Get by ID API')
// })

// //Update by ID Method
// router.patch('/update/:id', (req, res) => {
//     res.send('Update by ID API')
// })

// // Delete by ID Method
// router.delete('/delete/:id', (req, res) => {
//     res.send('Delete by ID API')
// })


module.exports = {
    postNode
}