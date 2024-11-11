
const express = require("express");
const {connection} = require("./db/mongodb");
const { userRouter } = require("./routes/user.routes");
require("dotenv").config();

const app = express();

app.use("/user", userRouter);

app.get("/",(req,res)=>{
    res.send("Welcome");
});

app.listen(process.env.PORT,async()=>{
    try{
        await connection;
        console.log("MongodDB is connected to server")
    }catch(err){
        console.log("error in connecting to database", err.message)
    }
    console.log(`Server is running at port ${process.env.PORT}`);
    
});