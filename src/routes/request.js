const express = require("express");
const requestRouter = express.Router();


const User = require("../models/user");
const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");

requestRouter.post(
  "/request/send/:status/:toUserId",
  userAuth,
  async (req, res) => {
    // fromUserId is the loggedIn userId (whoever is loggedIn that person user id us the fromUserId)
    try {
      const fromUserId = req.user._id; // This userId is come from the userAuth where we added the user in req.user which is a loggedIn user
      const toUserId = req.params.toUserId; //This userId is come from the parames or from the url of the request.
      const status = req.params.status; //making the url dynamic for sending the request and ignored request

      const allowedStatus = ["ignored", "interested"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({
          message: "Invalid status types : " + status,
        });
      }

      //{ now we have to check one thing that a person can't send a request to himself means we should insure that the toUserId != fromUserId -> This cen be done by schema PRE}

      const toUser = await User.findById(toUserId); //cheaking weather this id present in db or not.
      if (!toUser) {
        res.status(404).json({ message: "User not found!" });
      }

      // Try to insure that the same people can't send connection once again
      const existingConnectionRequest = await ConnectionRequest.findOne({
        //This should give us false
        $or: [
          //This is how  or queries written in db
          { fromUserId, toUserId }, // We are checking that if the fromUserId or toUserId already exist in db or not
          { fromUserId: toUserId, toUserId: fromUserId }, //Or we are checking the opposite of above if any of these exist we should have to throw an error
        ],
      });

      if (existingConnectionRequest) {
        return res
          .status(400)
          .send({ message: "Connection request already Exists!" });
      }

      const connectionRequest = new ConnectionRequest({
        fromUserId,
        toUserId,
        status,
      });

      const data = await connectionRequest.save(); //saving the connection request data in the db
      res.json({
        message:
          req.user.firstName + " is " + status + " in " + toUser.firstName,
        data,
      });
    } catch (err) {
      res.status(404).send("EROR: " + err.message);
    }
  }
);

requestRouter.post(
  "/request/review/:status/:requestId",
  userAuth,
  async (req, res) => {
    try {
      const { status, requestId } = req.params;
      const loggedInUser = req.user;

      const allowedStatus = ["accepted", "rejected"];
      if (!allowedStatus.includes(status)) {
        return res.status(400).json({ message: "Status not allowed" });
      }

      // request id should be valid so we checked the id : requestId
      // connection request should go to that user who is logged in at that time , we are strictlly checking for the user who want to send the ststus
      const connectionRequest = await ConnectionRequest.findOne({
        _id: requestId,
        toUserId: loggedInUser._id,
        status: "interested",
      });

      if(!connectionRequest){
        return res.status(404).json({message: "Connection request not found!"})
      }

      // now if we find the connection request then we attached the current status to the connection request to the "interested" statues wheather it is accepted or rejected
      connectionRequest.status = status;
     const data = await  connectionRequest.save();
      res.json({message:"Connection request " + status, data});

    } catch (err) {}
  }
);

module.exports = requestRouter;
