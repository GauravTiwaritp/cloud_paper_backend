const DataModels = require("../models/index");
const cloudSLA = require("../class/cloudSLAClass");
const converter = async () => {
  const { minValue: minRAValue, maxValue: maxRAValue } =
    await cloudSLA.MinAndMax(ResourceAvailability);
  const { minValue: minRSValue, maxValue: maxRSValue } =
    await cloudSLA.MinAndMax(ResourceSuccessRate);
  const { minValue: minTEValue, maxValue: maxTEValue } =
    await cloudSLA.MinAndMax(TurnaroundEfficiency);
  const { minValue: minDIValue, maxValue: maxDIValue } =
    await cloudSLA.MinAndMax(DataIntegrity);
  const response = {
    minRAValue,
    minRSValue,
    minDIValue,
    minDIValue,
    maxRAValue,
    maxRSValue,
    minTEValue,
    maxTEValue,
    maxDIValue,
  };
  return response;
};

module.exports = converter;
