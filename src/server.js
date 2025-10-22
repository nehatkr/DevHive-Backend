const express = require("express");
const connectToDB = require("./config/database");
const app = express(); //creation of express js application
const cookieParser = require("cookie-parser");

app.use(express.json()); //using a middle ware to read the json data of the req body of the api
app.use(cookieParser()); //this middleware is used to parse or read the cookie

const authRouter = require('./routes/auth');
const profileRouter = require('./routes/profile');
const requestRouter = require('./routes/request');

app.use("/", authRouter);
app.use("/", profileRouter);
app.use("/", requestRouter);

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
