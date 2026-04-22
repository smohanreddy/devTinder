const express = require('express');
const requestRouter = express.Router();
const ConnectionRequest = require('../models/connectionRequest');
const userAuth = require('../middleware/userAuth');
const User = require('../models/user');

requestRouter.post('/request/send/:status/:userId', userAuth ,async (req, res) => {
    try{
        const fromUserId = req.user._id;
        console.log(fromUserId);
        const status = req.params.status;
        const toUserId = req.params.userId;

        const allowedStatuses = ['interested', 'ignored'];
        if (!allowedStatuses.includes(status)) {
            return res.status(400).send({ error: 'Invalid status' });
        }

        const toUser = await User.findById(toUserId);
        if (!toUser) {
            return res.status(404).send({ error: 'User not found' });
        }
        const existingRequest = await ConnectionRequest.findOne({ 
            $or:  [{ fromUserId, toUserId}, { fromUserId: toUserId, toUserId: fromUserId }] 
        });
        if (existingRequest) {
            return res.status(400).send({ error: 'Connection request already exists' });
        }
        const connectionRequest = new ConnectionRequest({
            fromUserId,
            toUserId,
            status
        });
        console.log(connectionRequest);
        await connectionRequest.save();
        res.json({
            message: 'Connection request sent successfully',
            connectionRequest
        });
    }catch(error){
        res.status(400).send({error: error.message});
    }
});

requestRouter.post('/request/review/:status/:requestId', userAuth, async (req, res) => {
    try{
        const loggnedInUserId = req.user._id;
        const {status,requestId} = req.params;

        const allowedStatuses = ["accepted", "rejected"];
        if(!allowedStatuses.includes(status)){
            return res.status(400).send({error: 'Invalid status'});
        }

        const connectionRequest = await ConnectionRequest.findOne({ _id: requestId, toUserId: loggnedInUserId, status: 'interested' });

        if(!connectionRequest){
            return res.status(404).send({error: 'Connection request not found or already reviewed'});
        }
        connectionRequest.status = status;
        await connectionRequest.save();
        res.json({
            message: `Connection request ${status} successfully`,
            connectionRequest
        });

    }catch(error){
        res.status(400).send({error: error.message});
    }
});

module.exports = requestRouter;

