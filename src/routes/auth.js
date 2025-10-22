const express = require('express')
const authRouter = express.Router();

const { validateSignUpData } = require("../utils/validation");
const User = require("../models/user");
const bcrypt = require("bcrypt");




authRouter.post("/signup", async (req, res) => {
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

authRouter.post("/login", async (req, res) => {
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

authRouter.post("/logout", async(req, res)=>{
    res.cookie("token", null, {    //pass the token as null and expire the cookie write their
        expires:  new Date(Date.now())
    })
    res.send("Logout Successfull!!");
})

module.exports =  authRouter
