const jwt = require('jsonwebtoken');
const User = require('../models/user');

const userAuth = async (req, res, next) => {
     const token = req.cookies.token;
        if(!token) {
            return res.status(401).send("Unauthorized: No token provided");
        }
        const decodedToken = await jwt.verify(token, process.env.JWT_SECRET);
        const userID = decodedToken._id;
        const user = await User.findById(userID);
        if(!user) {
            throw new Error("User not found");
        }
        req.user = user;
        next();
};

module.exports = userAuth;