const DataModels = require("../models/index");
const cloudSLA = require("../class/cloudSLAClass");
//const cloudsla = new cloudSLA();
const MinAndMax = async (payload) => {
  let minValue = await DataModels.SLA.find({}, { payload: 1 })
    .sort({ [payload]: 1 })
    .limit(1);
  let maxValue = await DataModels.SLA.find({}, { payload: 1 })
    .sort({ [payload]: -1 })
    .limit(1);
  if (isNaN(minValue)) {
    minValue = 0; // Default value for minValue if it's NaN
  }

  if (isNaN(maxValue)) {
    if (payload === "ResourceAvailability") {
      maxValue = 100; // Default value for maxValue if it's NaN and payload is 'ResourceAvailability'
    } else {
      maxValue = 1; // Default value for maxValue if it's NaN and payload is not 'ResourceAvailability'
    }
  }
  const response = { minValue, maxValue };
  return response;
};
const converter = async () => {
  const { minValue: minRAValue, maxValue: maxRAValue } = await MinAndMax(
    "ResourceAvailability"
  );
  const { minValue: minRSValue, maxValue: maxRSValue } = await MinAndMax(
    "ResourceSuccessRate"
  );
  const { minValue: minTEValue, maxValue: maxTEValue } = await MinAndMax(
    "TurnaroundEfficiency"
  );
  const { minValue: minDIValue, maxValue: maxDIValue } = await MinAndMax(
    "DataIntegrity"
  );
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
