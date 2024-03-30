const { SLA, minMaxSlaValue } = require("./cloudSLA");
const { feedback } = require("./feedback");
const trustValue = require("./trustValue");
const { userSla, userPCSP } = require("./userSLA");

module.exports = {
  SLA,
  feedback,
  trustValue,
  userSla,
  minMaxSlaValue,
  userPCSP,
};
