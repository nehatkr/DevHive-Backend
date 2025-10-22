const express = require("express");
const requestRouter = express.Router();

const { userAuth } = require("../middlewares/auth");


requestRouter.post("/sendConnectionRequest", userAuth, async (req, res) => {
  console.log("Sending a connection request");
  const user = req.user;
  res.send(user.firstName + " Sent the connection request!");
});

module.exports = requestRouter;
