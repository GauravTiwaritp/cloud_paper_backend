const mongoose = require("mongoose");
require("dotenv").config();
const connectToDatabase = async () => {
  try {
    await mongoose.connect(process.env.Mongodb_Url);
    console.log("connected to DataBase");
  } catch (error) {
    console.error(error.message);
  }
};

module.exports = connectToDatabase();
