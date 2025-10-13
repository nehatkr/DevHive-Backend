const express = require("express");
const connectToDB = require("./config/database");
const User = require("./models/user");
const app = express(); //creation of express js application

app.use(express.json()); //using a middle ware to read the json data of the req body of the api

app.post("/signup", async (req, res) => {
  console.log(req.body)
  // creating the new instance of the user model
  //creating the new user with this data
  const user = new User(req.body);
  try {
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("Error occured :" + err.message);
  }
});

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
