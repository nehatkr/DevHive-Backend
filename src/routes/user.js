const express = require("express");
const userRouter = express.Router();

const { userAuth } = require("../middlewares/auth");
const ConnectionRequest = require("../models/connectionRequest");
const User = require('../models/user')

const USER_SAFE_DATA = "firstName lastName photoUrl age gender skills about";

// get all the pending connection request of all the loggedIn user
userRouter.get("/user/requests/received", userAuth, async (req, res) => {
  try {
    const loggedInUser = req.user;

    const connectionRequests = await ConnectionRequest.find({
      toUserId: loggedInUser._id,
      status: "interested",
    }).populate("fromUserId", USER_SAFE_DATA); //using populate we can refers the user model for the firstName and lastName of the fromUserId
    // populate("fromUserId", "firstName"  "lastName")  //same thing as above

    res.json({
      message: "Data Fetched Successfully",
      data: connectionRequests,
    });
  } catch (err) {
    res.status(400).send("ERROR: " + err.message);
  }
});

// get all the request of same status
userRouter.get("/user/connections", userAuth, async (req, res) => {
  // lets find out the persons all the connection of other peoples. finding the connection of a person where the person can pe toUser or fromUser but ststus should always be accepted
  try {
    const loggedInUser = req.user;
    const connectionRequests = await ConnectionRequest.find({
      $or: [
        { toUserId: loggedInUser, status: "accepted" },
        { fromUserId: loggedInUser, status: "accepted" },
      ],
    })
      .populate("fromUserId", USER_SAFE_DATA)
      .populate("toUserId", USER_SAFE_DATA);

    console.log(connectionRequests);

    const data = connectionRequests.map((row) => {
      if (row.fromUserId._id.toString() === loggedInUser._id.toString()) {
        return row.toUserId;
      }
      return row.fromUserId;
    });
    res.json({ data });
  } catch (err) {
    res.status(400).send({ message: err.message });
  }
});

// get the feed for a person
userRouter.get("/feed", userAuth, async (req, res) => {

//   user should not see the profile of whom hi accepted or rejected or idnored . and person also not see the card of connected people bcz they are connected already.
//   and the person should no see his card also

  try {

    // User should see all the users card except
    // 0. his own card
    // 1. idnored people
    // 2. his connections
    // 3. already sent the connection request

    const loggedInUser = req.user;  //come from userAuth

    // Now lets find all the connection requests (recieved + sent)
    const connectionRequests = await ConnectionRequest.find({
        $or: [{ fromUserId: loggedInUser._id}, { toUserId: loggedInUser._id}]
    }).select("fromUserId toUserId");

    // set is a data structure which contain only the unique field
    const hideUsersFromFeed = new Set();
    connectionRequests.forEach((req)=>{    //these are the people whom I want to hide
        hideUsersFromFeed.add(req.fromUserId.toString());
        hideUsersFromFeed.add(req.toUserId.toString());
    })

    const users = await User.find({
        $and: [                                             //and means insuring both query should be true
            {_id: {$nin: Array.from(hideUsersFromFeed)}},  //nin means not in -> this array of hideUsersFromFeed
            {_id: {$ne: loggedInUser._id}}                 //ne means not equal to all these are the db queries
        ],
    }).select(USER_SAFE_DATA)

    res.send(users);

  } catch (err) {
    res.status(400).json({ message: err.message });
  }
});
module.exports = userRouter;
