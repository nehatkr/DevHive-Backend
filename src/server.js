const express = require("express");
const connectToDB = require("./config/database");
const User = require("./models/user");
const app = express(); //creation of express js application
const { validateSignUpData } = require("./utils/validation");
const bcrypt = require("bcrypt");
const cookieParser = require("cookie-parser");
const jwt = require("jsonwebtoken");
const { userAuth } = require("./middlewares/auth");

app.use(express.json()); //using a middle ware to read the json data of the req body of the api
app.use(cookieParser()); //this middleware is used to parse or read the cookie

app.post("/signup", async (req, res) => {
  try {
    const { firstName, lastName, emailId, password, skills } = req.body;

    // validate the user data
    validateSignUpData(req);

    // then encrypt the password before the signup
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash);

    console.log(req.body);
    // creating the new instance of the user model
    //creating the new user with this data
    const user = new User({
      firstName,
      lastName,
      emailId,
      skills,
      password: passwordHash,
    });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.post("/login", async (req, res) => {
  try {
    const { emailId, password } = req.body;
    const user = await User.findOne({ emailId: emailId });
    if (!user) {
      console.log("Invalid credentials");
    }

    const isPasswordValid = await user.validatePassword(password) ;

    if (isPasswordValid) {
     const token = await user.getJWT();

      // Add the token to cookie and send the response back to the user
      res.cookie("token", token, {
        expires: new Date(Date.now() + 8 * 3600000),
      });
      res.send("Logined successfull");
    } else {
      throw new Error("Invalid credentials");
    }
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.get("/profile", userAuth, async (req, res) => {
  try {
    const user = req.user;
    res.send(user);
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// Api for send connection request
app.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a connection request");
  const user = req.user;
  res.send(user.firstName + " Sent the connection request!");
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
