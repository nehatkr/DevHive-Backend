const express = require("express");
const connectToDB = require("./config/database");
const app = express(); //creation of express js application
const cookieParser = require("cookie-parser");
const cors = require('cors')

app.use(cors({
  origin: "http://localhost:5173",     //whiteListing this domain
  credentials : true
}));
app.use(express.json()); //using a middle ware to read the json data of the req body of the api
app.use(cookieParser()); //this middleware is used to parse or read the cookie

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');
const userRouter = require('./routes/user');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);
app.use("/", userRouter);

connectToDB()
  .then(() => {
    console.log("DataBase connected successfully");
    const PORT = 3000;
    app.listen(PORT, () => {
      console.log(`Server is successfully listening on port: ${PORT}`);
    });
  })
  .catch((err) => {
    console.error("DataBase connection failed");
  });
