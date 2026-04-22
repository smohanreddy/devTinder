const express = require('express');
const User = require('../models/user');
const userAuth = require('../middleware/userAuth');
const bcrypt = require('bcrypt');
const validateProfileBody = require('../utils/validateProfileBody');


const profileRouter = express.Router();

profileRouter.get("/profile/view", userAuth, async (req, res) => {
    
    try {
        res.send(req.user);
    } catch (error) {
        res.status(400).send("Error fetching user profile" + error);
    }
});

profileRouter.patch("/profile/edit", userAuth, async (req, res) => {
    
    try {
        if(!validateProfileBody(req)) {
            throw new Error("Invalid fields in request body");
        }
        const logginedUser = req.user;
        Object.keys(req.body).forEach((field) => {logginedUser[field] = req.body[field]});
        await logginedUser.save();
        res.json({message: "Profile edit page", 
            data : logginedUser}
        );
    } catch (error) {
        res.status(400).send("Error fetching user profile" + error.message);
    }
});

profileRouter.patch("/profile/passwordEdit", userAuth, async (req, res) => {
    try {
        const logginedUser = req.user;
        if(req.body.emailId !== logginedUser.emailId) {
            throw new Error("Email ID does not match the logged in user");
        }
        const hashedPassword = await bcrypt.hash(req.body.password, 10);
        logginedUser.password = hashedPassword;
        await logginedUser.save();
        res.json({message: "Password updated successfully"});

    } catch (error) {
        res.status(400).send("Error fetching user profile" + error.message);
    }
});



module.exports = profileRouter;