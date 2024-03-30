const DataModels = require("../models/index");
const userSLA = require("../class/userSLAClass");
const userSla = new userSLA();
const cloudSLA = require("../class/cloudSLAClass");
const cloudSla = new cloudSLA();
const saveUserSLAParameter = async (req, res) => {
  const {
    ResourceAvailability,
    ResourceSuccessRate,
    TurnaroundEfficiency,
    DataIntegrity,
  } = userSla.convertSlaValue(req.body);
  const { UserName, work } = req.body;
  await userSla.saveUserSlaValue({
    UserName,
    work,
    ResourceAvailability,
    ResourceSuccessRate,
    TurnaroundEfficiency,
    DataIntegrity,
  });
};

const recommendCloudService = async (req, res) => {
  const { UserName, work } = req.body;
  const response = await userSla.findUserSlaValue({ UserName, work });
  const response1 = await cloudSla.findSLAvalues();
  const finalResponse = [];
  response1.forEach(async (element) => {
    let sum =
      element.NResourceAvailability * response.ResourceAvailability +
      element.NResourceSuccessRate * response.ResourceSuccessRate +
      element.NTurnaroundEfficiency * response.TurnaroundEfficiency +
      element.NDataIntegrity * response.DataIntegrity;
    if (sum > 0.5) {
      finalResponse.push(element);
    }
  });
  let finalResponse1 = JSON.stringify(finalResponse);
  res.json({ data: finalResponse1 });
};

const selectCloudService = async (req, res) => {
  const { _id, UserName } = req.body;
  const resp = await userSla.returnUserPreferedCSP(_id);
  const obj = { _id: resp_id, UserName: UserName };
  const response = await userSla.saveUserPreferedCSP(obj);
  res.json({ data: response });
};

module.exports = {
  saveUserSLAParameter,
  recommendCloudService,
  selectCloudService,
};
