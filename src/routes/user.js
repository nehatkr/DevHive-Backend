const express = require('express');
const userRouter = express.Router();

const {userAuth} = require('../middlewares/auth')
const ConnectionRequest = require('../models/connectionRequest')

// get all the pending connection request of all the loggedIn user
userRouter.get("/user/requests/received", userAuth, async(req, res)=>{
     try{const loggedInUser = req.user;

     const connectionRequests = await ConnectionRequest.find({
        toUserId : loggedInUser._id,
        status : "interested"
     });

     res.json({message: "Data Fetched Successfully", data: connectionRequests})
    }catch(err){
        res.status(400).send("ERROR: " + err.message);
    }
})
module.exports = userRouter