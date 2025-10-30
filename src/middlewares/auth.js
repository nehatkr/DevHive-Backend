const jwt = require("jsonwebtoken");
const User = require("../models/user");

const userAuth = async (req, res, next) => {
  try {
    // Read the token from the req.cookie
    const cookies = req.cookies;
    const { token } = cookies;

    if (!token) {
      return res.status(401).send("Please Login!");
    }

    // viladiate the token
    const decodedObj = await jwt.verify(token, "DEV@Tinder$567");
    const { _id } = decodedObj;

    // find the user wheather the user exists in a database
    const user = await User.findById(_id);
    if (!user) {
      throw new Error("User not found");
    }

    req.user= user;
    next();
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
};

module.exports = {
  userAuth,
};
