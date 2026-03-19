
//GVArxO4WOtThruuF

const express = require('express');
const mongoose = require('mongoose');

const app = express();

// Middleware 
app.use("/",(req,res,next)=>{
    res.send("IT WORKS");
})

mongoose.connect("mongodb+srv://banulabinath:banula123@cluster0.2doe0aq.mongodb.net/?appName=Cluster0")
.then(()=>console.log("Connected to MongoDB"))
.then(()=>{
    app.listen(5000)
})
.catch((err)=>console.log(err));   


