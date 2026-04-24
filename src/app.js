const express = require('express');
const cookieParser = require('cookie-parser');
const app = express();
const connectDB = require('./config/database');
const cors = require('cors');
app.use(express.json());
app.use(cookieParser());
app.use(cors({
    origin: 'http://localhost:5173', // Replace with your frontend URL
    credentials: true, // Allow cookies to be sent
}));
const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);




// app.patch("/user", async (req, res) => {
//     const userId = req.body.userId;
//     const updateData = req.body;
//     try {
//         const allowedUpdates = ["firstName", "password","lastName", "gender", "age"];
//         const isValidOperation = Object.keys(updateData).every((update) => allowedUpdates.includes(update));

//         if (!isValidOperation) {
//             throw new Error("Invalid update fields");
//         }

//         await User.findByIdAndUpdate(userId, updateData);
//         res.send("User updated successfully");
//     } catch (error) {
//         res.status(400).send("Error updating user" + error);
//     }
// });

// app.get("/user", async (req, res) => {
//     const userID = req.body.emailId;

//     console.log(userID);
//     try {
//         const user = await User.find({emailId: userID});
//         if(user.length === 0) {
//             return res.status(404).send("No users found");
//         }else{
//             res.send(user);
//         }
//     } catch (error) {
//         res.status(400).send("Error fetching users");
//     }
// });



// app.delete("/user", async (req, res) => {
//     const userID = req.body.userId;

//     console.log(userID);
//     try {
//         const user = await User.findByIdAndDelete(userID);
//         if(!user) {
//             return res.status(404).send("User not found");
//         }else{
//             res.send("User deleted successfully");
//         }
//     } catch (error) {
//         res.status(400).send("Error fetching users");
//     }
// });

// app.get("/feed", async (req, res) => {
    
//     try {
//         const user = await User.find({});
//         if(user.length === 0) {
//             return res.status(404).send("No users found");
//         }else{
//             res.send(user);
//         }
//     } catch (error) {
//         res.status(400).send("Error fetching users");
//     }
// });


connectDB().then(() => {
    console.log('Connected to MongoDB');
    app.listen(3000, () => {
    console.log('Server is running on port 3000');
});}).catch((err) => {
    console.error('Failed to connect to MongoDB', err);
});

