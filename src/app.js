const express = require('express');
const app = express();

app.use("/home", (req, res) =>{
    res.send('Hello World from dashboard');
})

app.use("/hello", (req, res) =>{
    res.send('Hello World');
})

app.use("/about", (req, res) =>{
    res.send('About Us');
})

app.listen(3000, () => {
    console.log('Server is running on port 3000');
});