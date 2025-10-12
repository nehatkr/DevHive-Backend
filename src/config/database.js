const mongoose = require("mongoose");

const connectToDB = async () => {
  await mongoose.connect(
    "mongodb+srv://NodeJs_Backend:DevHive_0823@devhive.cuefbal.mongodb.net/devHive"
  );
};

module.exports = connectToDB;


