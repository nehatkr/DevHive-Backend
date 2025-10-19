const express = require("express");
const connectToDB = require("./config/database");
const User = require("./models/user");
const app = express(); //creation of express js application
const {validateSignUpData} = require('./utils/validation')
const bcrypt = require('bcrypt')
const cookieParser  = require('cookie-parser');

app.use(express.json()); //using a middle ware to read the json data of the req body of the api
app.use(cookieParser());  //this middleware is used to parse or read the cookie

app.post("/signup", async (req, res) => {

  try {

    const {firstName, lastName, emailId, password,skills} = req.body;

  // validate the user data
  validateSignUpData(req);

  // then encrypt the password before the signup
    const passwordHash = await bcrypt.hash(password, 10);
    console.log(passwordHash)


  console.log(req.body);
  // creating the new instance of the user model
  //creating the new user with this data
  const user = new User({
    firstName,
    lastName,
    emailId,
    skills,
    password:passwordHash,
  });
    await user.save();
    res.send("User added successfully");
  } catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
});

app.post("/login", async(req,res)=>{
try{
  const {emailId, password} = req.body;
  const user = await User.findOne({emailId:emailId});
  if(!user){
    console.log("Invalid credentials")
  }

  const isPasswordValid = await bcrypt.compare(password, user.password);

  if(isPasswordValid){
    res.send("Logined successfull")
  }else{
    throw new Error("Invalid credentials")
  }

}catch (err) {
    res.status(400).send("ERROR :" + err.message);
  }
})

// GET user by email
app.get("/user", async (req, res) => {
  const userEmail = req.body.emailId;

  try {
    const users = await User.find({ emailId: userEmail });
    if (users.length === 0) {
      res.status(404).send("User not found");
    } else {
      res.send(users);
    }
  } catch (err) {
    res.status(400).send("Something went wrong");
  }
});

// feed API-GET / feed - get all the users from the database
app.get("/feed", async (req, res) => {
  try {
    const users = await User.find({});
    res.send(users);
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});

// Delete the user from the database
app.delete("/user", async (req, res) => {
  const userId = req.body.userId;
  try {
    const user = await User.findByIdAndDelete(userId);
    // const user = await User.findByIdAndDelete({_id : userId});
    res.send("User deleted successfully");
  } catch (e) {
    res.status(400).send("Something went wrong");
  }
});

// Update the user info in the database
app.patch("/user/:userId", async (req, res) => {
  const userId = req.params?.userId;
  const data = req.body;
  try {
    const ALLOWED_UPDATES = [
      "skills",
      "age",
      "gender",
      "about",
      "photoUrl",
    ];
    const isUpdateAllowed = Object.keys(data).every((k) =>
      ALLOWED_UPDATES.includes(k)
    );

    if (!isUpdateAllowed) {
      throw new Error("Update not allowed");
    }

    if(data?.skills.length>10){
      throw new Error("Skills can not be more than 10")
    }

    const user = await User.findByIdAndUpdate({ _id: userId }, data, {
      returnDocument: "after",
      runValidators: true,
    });
    console.log(user);
    res.send("User updated successfully");
  } catch (err) {
    res.status(400).send("UPDATE FAILED :" + err.message);
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
