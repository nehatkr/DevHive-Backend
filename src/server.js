const express = require("express");
const connectToDB = require("./config/database");
const app = express(); //creation of express js application
const cookieParser = require("cookie-parser");
const cors = require('cors')

app.use(cors({
  origin: ["http://localhost:5173", "https://devhive-web.netlify.app/"],     //whiteListing this domain
  credentials : true
}));
app.use(express.json()); //using a middle ware to read the json data of the req body of the api
app.use(cookieParser()); //this middleware is used to parse or read the cookie

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');
require('dotenv').config();


app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

app.use("/", (req,res)=>{
  res.send({
    activeStatus: true,
    error:false,
  })
})

connectToDB()
  .then(() => {
    console.log("DataBase connected successfully");
    
    app.listen(process.env.PORT, () => {
      console.log(`Server is successfully listening on port: 3000`);
    });
  })
  .catch((err) => {
    console.error("DataBase connection failed");
  });
