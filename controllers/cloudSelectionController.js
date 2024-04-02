const DataModels = require("../models/index");
const userSLA = require("../class/userSLAClass");
const userSla = new userSLA();
const cloudSLA = require("../class/cloudSLAClass");
const cloudSla = new cloudSLA();
const saveUserSLAParameter = async (req, res) => {
  const {
    UserName,
    work,
    ResourceAvailability,
    ResourceSuccessRate,
    TurnaroundEfficiency,
    DataIntegrity,
  } = userSla.convertSlaValue(req.body);
  const result = await userSla.saveUserSlaValue({
    UserName,
    work,
    ResourceAvailability,
    ResourceSuccessRate,
    TurnaroundEfficiency,
    DataIntegrity,
  });
  res.json({ data: result });
};

const recommendCloudService = async (req, res) => {
  try {
    const { UserName, work } = req.body;
    const response = await userSla.findUserSlaValue({ UserName, work });
    console.log(response);
    const response1 = await cloudSla.findSLAvalues();
    console.log(response1);
    const finalResponse = [];

    for (const element of response1) {
      console.log(element.NResourceAvailability, response.ResourceAvailability);
      let sum =
        element.NResourceAvailability * response?.ResourceAvailability +
        element.NResourceSuccessRate * response?.ResourceSuccessRate +
        element.NTurnaroundEfficiency * response?.TurnaroundEfficiency +
        element.NDataIntegrity * response?.DataIntegrity;
      console.log(sum);
      if (sum > 0.5) {
        finalResponse.push(element);
      }
    }

    res.json({ data: finalResponse });
  } catch (error) {
    console.error(error);
    res.status(500).json({ error: "Internal server error" });
  }
};

const selectCloudService = async (req, res) => {
  const { _id, UserName } = req.body;
  const resp = await userSla.returnUserPreferedCSP(_id);
  console.log(resp);
  const obj = { _id: resp._id, UserName: UserName };
  const response = await userSla.saveUserPreferedCSP(obj);
  res.json({ data: response });
};

const saveCloudSla = async (req, res) => {
  const response = await cloudSla.saveCloudSLAValues(req.body);
  res.json(response);
};

module.exports = {
  saveUserSLAParameter,
  recommendCloudService,
  selectCloudService,
  saveCloudSla,
};
