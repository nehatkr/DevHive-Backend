const mongoose = require("mongoose");
const validator = require("validator")

const userSchema = new mongoose.Schema(
  {
    firstName: {
      type: String,
      require: true,
      minLength: 4,
      maxLength: 50,
    },
    lastName: {
      type: String,
    },
    emailId: {
      type: String,
      lowercase: true,
      required: true,
      unique: true,
      trim: true,
      validate(value){
        if(!validator.isEmail(value)){
            throw new Error("Not a valid Email Address: " + value)
        }
      }
    },
    password: {
      type: String,
      required: true,
       validate(value){
        if(!validator.isStrongPassword(value)){
            throw new Error("Enter a strong password: " + value)
        }
      }
    },
    age: {
      type: Number,
      min: 18,
    },
    gender: {
      type: String,
      lowercase:true,
      validate(value) {
        if (!["male", "female", "others"].includes(value)) {
          throw new Error("Gender data is not valid");
        }
      },
    },
    photoUrl: {
      type: String,
      default: "https://sipl.ind.in/wp-content/uploads/2022/07/dummy-user.png",
       validate(value){
        if(!validator.isURL(value)){
            throw new Error("Not a valid Photo Url: " + value)
        }
      }
    },
    about: {
      type: String,
      default: "This is the default Description of the user",
    },
    skills: {
      type: [String],
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("User", userSchema);
