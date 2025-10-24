const mongoose = require("mongoose");

const connectionRequestSchema = new mongoose.Schema(
  {
    fromUserId: {
      type: mongoose.Schema.Types.ObjectId, //this is the user id type
      required: true,
    },
    toUserId: {
      type: mongoose.Schema.Types.ObjectId, //this is the user id type
      required: true,
    },
    status: {
      type: String,
      required: true,
      enum: {
        values: ["ignored", "rejected", "accepeted", "interested"],
        message: `{values} is incorrect status type`,
      },
    },
  },
  { timestamps: true }
);

//save is a kind a event - this pre call this event whenever this event is trigger
// Always use normal function not a arrow function for the schema methods and pre functions
//every time this will be called when the connection Request will be saved - whenever we save a connection request
// we can check any validation here we are going to check that id the fromUserId or toUserId is same or not.

connectionRequestSchema.pre("save", function(next){ 
  const connectionRequest = this;                  
if (connectionRequest.fromUserId.equals(connectionRequest.toUserId)) {
throw new this.errors("Cannot send the connection request to yourself!")
}
next();
})

const ConnectionRequestModel =  mongoose.model("ConnectionRequest", connectionRequestSchema);

module.exports = ConnectionRequestModel;
