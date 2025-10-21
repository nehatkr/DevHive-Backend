const express = require('express')
const authRouter = express.Router();

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

module.exports = {
    authRouter,
}