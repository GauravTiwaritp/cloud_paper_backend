const DataModels = require("../models/index");
const converter = require("../utils/converter");
class cloudSLA {
  async MinAndMax(payload) {
    const minValue = await DataModels.SLA.find({}, { payload: 1 })
      .sort(payload)
      .limit(1);
    const maxValue = await DataModels.SLA.find({}, { payload: 1 })
      .sort(-payload)
      .limit(1);
    const response = { minValue, maxValue };
    return response;
  }
  async saveCloudSLAValues(payload) {
    const result = await DataModels.SLA.save({
      ResourceAvailability: payload.ResourceAvailability,
      ResourceSuccessRate: payload.ResourceSuccessRate,
      TurnaroundEfficiency: payload.TurnaroundEfficiency,
      DataIntegrity: payload.DataIntegrity,
      cost: cost,
      dataConfidentialityAndIntegrity: dataConfidentialityAndIntegrity,
    });
    const res = await converter();
    let NResourceAvailability =
      (payload.ResourceAvailability - res.minRAValue) /
      (res.maxRAValue - res.minRAValue);
    let NResourceSuccessRate =
      (payload.ResourceSuccessRate - res.minRSValue) /
      (res.maxRSValue - res.minRSValue);
    let NTurnaroundEfficiency =
      (payload.TurnaroundEfficiency - res.minTEValue) /
      (res.maxTEValue - res.minTEValue);
    let NDataIntegrity =
      (payload.DataIntegrity - res.minDIValue) /
      (res.maxDIValue - res.minDIValue);
    await DataModels.SLA.findByIdAndUpdate(
      { _id: result._id },
      {
        NResourceAvailability,
        NResourceSuccessRate,
        NTurnaroundEfficiency,
        NDataIntegrity,
      }
    );
  }
  async findSLAvalues() {
    return await DataModels.SLA.find({}).sort({ trustValue: 1 });
  }
}

module.exports = cloudSLA;
