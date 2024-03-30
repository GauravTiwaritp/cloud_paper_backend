const mongoose = require("mongoose");

const userSLA = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  work: {
    type: String,
    required: true,
  },
  ResourceAvailability: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  ResourceSuccessRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  TurnaroundEfficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  DataIntegrity: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
});

const userPreferedCSP = new mongoose.Schema({
  UserName: {
    type: String,
  },
  id: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "usersla",
  },
});

const userSla = mongoose.model("userSla", userSLA);
const userPCSP = mongoose.model("userPCSP", userPreferedCSP);
module.exports = { userSla, userPCSP };
