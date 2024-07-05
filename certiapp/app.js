
const {mongoose } = require('mongoose');
const express=require('express');
const routes=require('./routes.js');
const dotenv=require('dotenv');


const app=express();
const PORT = 3006;
dotenv.config();

app.listen(PORT, () =>{
    console.log(`server is running on port ${PORT}`);
});

app.use(express.json());
app.use('/',routes); 
const url=process.env.mongodb_uri;



mongoose.connect(
   url // "mongodb://localhost:27017/cetiapp"
);

const database = mongoose.connection;
database.on("error",(error) => {
    console.log(error);
});

database.once("connected", () =>{ 
    console.log("database connected");
});