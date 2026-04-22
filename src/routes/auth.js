const express = require('express');
const bcrypt = require('bcrypt');
const User = require('../models/user');
const userAuth = require('../middleware/userAuth');

const authRouter = express.Router();

authRouter.post("/signup", async (req, res) => {
    try {
        const { firstName, lastName, emailId, password } = req.body;
        const hashedPassword = await bcrypt.hash(password, 10);
        const user = new User({
            firstName,
            lastName,
            emailId,
            password: hashedPassword,
        });
        await user.save();
        res.send("User created successfully");
    } catch (error) {
        res.status(400).send("Error creating user" + error);
    }
});

authRouter.post("/login", async (req, res) => {
    try {
        const {emailId, password } = req.body;
        const user = await User.findOne({emailId: emailId});
        if (!user) {
            throw new Error("User not found");
        }
        const isPasswordMatch = await user.passwordValidate(password);
        if(isPasswordMatch){
            const token = await user.getJWT();
            res.cookie("token", token);
            res.send("User logged in successfully");
        }else{
            throw new Error("Invalid password");
        }
    } catch (error) {
        res.status(400).send("Error logging in user" + error);
    }
});

authRouter.post("/logout", userAuth, async (req, res) => {
    try {
       res.cookie("token", "", { expires: new Date(0) });
       res.send("User logged out successfully");
    } catch (error) {
        res.status(400).send("Error logging out user" + error);
    }
});



module.exports = authRouter;