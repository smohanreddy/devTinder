const expess = require('express');
const userRouter = expess.Router();
const userAuth = require('../middleware/userAuth');
const ConnectionRequest = require('../models/connectionRequest');
const User = require('../models/user');

userRouter.get('/user/requests/received', userAuth, async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const connectionRequests = await ConnectionRequest.find({ toUserId: loggedInUserId, status: 'interested' }).populate('fromUserId', 'firstName lastName');
        res.json({message: "Connection requests received", connectionRequests});

    }catch(err){
        res.status(400).send("Error " + err.message);
    }
});

userRouter.get('/user/connections', userAuth, async(req, res) => {
    try{
        const loggedInUserId = req.user._id;
        const acceptedConnections = await ConnectionRequest.find({ 
            $or: [
                { fromUserId: loggedInUserId, status: 'accepted' },
                { toUserId: loggedInUserId, status: 'accepted' }
            ]
        }).populate('fromUserId', 'firstName lastName').populate('toUserId', 'firstName lastName');
        const data = acceptedConnections.map(con => con.fromUserId._id.toString() === loggedInUserId.toString() ? con.toUserId : con.fromUserId );
        console.log(data);
        res.json({message: "Accepted connections", data });

    }catch(err){
        res.status(400).send("Error " + err.message);
    }
});

userRouter.get('/feed', userAuth, async(req, res) => {
    try{

        const page = parseInt(req.query.page) || 1;
        let limit = parseInt(req.query.limit) || 10;
        limit = limit >20 ? 20 : limit; // Set a maximum limit of 20
        const loggedInUserId = req.user._id;

        const hiddenConnections = await ConnectionRequest.find({
            $or: [
                { fromUserId: loggedInUserId},
                { toUserId: loggedInUserId}
            ]
        }).select('fromUserId toUserId ');

        const hiddenUserIds = new Set();
        hiddenConnections.forEach(con => {
            hiddenUserIds.add(con.fromUserId.toString());
            hiddenUserIds.add(con.toUserId.toString());
        });

        const user = await User.find({
            $and: [
                { _id: { $ne: loggedInUserId } },
                { _id: { $nin: Array.from(hiddenUserIds) } }
            ]
        }).select('firstName lastName').skip((page - 1) * limit).limit(limit);
        
        // Further processing of hiddenUserIds can be done here
        res.json({ message: "Feed data", user });

    }catch(err){
        res.status(400).send("Error " + err.message);
    }
});

module.exports = userRouter;