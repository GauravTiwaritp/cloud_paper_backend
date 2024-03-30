const DataModels = require("../models/index");
const { correlation } = require("node-correlation");
class userSLA {
  async saveUserSlaValue(payload) {
    await DataModels.userSla.create({ payload });
  }

  convertSlaValue(payload) {
    let {
      ResourceAvailability,
      ResourceSuccessRate,
      TurnaroundEfficiency,
      DataIntegrity,
    } = payload;
    let Total =
      ResourceAvailability +
      ResourceSuccessRate +
      TurnaroundEfficiency +
      DataIntegrity;
    ResourceAvailability = ResourceAvailability / Total;
    ResourceSuccessRate = ResourceSuccessRate / Total;
    TurnaroundEfficiency = TurnaroundEfficiency / Total;
    DataIntegrity = DataIntegrity / Total;
    const response = {
      ResourceAvailability: ResourceAvailability,
      ResourceSuccessRate: ResourceSuccessRate,
      TurnaroundEfficiency: TurnaroundEfficiency,
      DataIntegrity: DataIntegrity,
    };
    return response;
  }
  async findUserSlaValue(payload) {
    return await DataModels.userSla.find({
      UserName: payload.UserName,
      work: payload.work,
    });
  }
  async saveUserPreferedCSP(payload) {
    return await DataModels.userPCSP.create({
      UserName: payload.obj.UserName,
      id: payload.obj._id,
    });
  }
  async returnUserPreferedCSP(payload) {
    return await DataModels.SLA.findOne({ _id: payload._id });
  }

  async feedbackInput(payload) {
    const {
      id,
      cloudServiceProvider,
      feedbackValueAv,
      feedbackValueSR,
      feedbackValueTE,
      feedbackValueDI,
    } = payload;
    const totalNumberofRecords = await DataModels.feedback
      .find({ cloudServiceProvider: cloudServiceProvider })
      .countDocuments();
    const res = DataModels.feedback.find({
      cloudServiceProvider: cloudServiceProvider,
    });
    const feedbackArray = [
      feedbackValueAv,
      feedbackValueSR,
      feedbackValueTE,
      feedbackValueDI,
    ];
    let positiveValueCorrelationRecords = 0;
    res.forEach((record) => {
      let givenFeedBackArray = [
        record.feedbackValueAv,
        record.feedbackValueSR,
        record.feedbackValueTE,
        record.feedbackValueDI,
      ];
      let correlation1 = correlation(feedbackArray, givenFeedBackArray);
      if (correlation1 > 0) {
        positiveValueCorrelationRecords = positiveValueCorrelationRecords + 1;
      }
    });
    if (positiveValueCorrelationRecords / totalNumberofRecords > 0.5) {
      let currentFeedbackValue =
        (feedbackValueAv +
          feedbackValueSR +
          feedbackValueTE +
          feedbackValueDI) /
        40;
      const previousFeedbackValue = await DataModels.feedback.aggregate([
        {
          $group: {
            cloudServiceProvider: cloudServiceProvider,
            prevFeedbackValue: { $sum: "totalTrustValue" },
          },
        },
      ]);
      const newFeedbackValue =
        (1 - positiveValueCorrelationRecords / totalNumberofRecords) *
          previousFeedbackValue.prevTrustValue +
        currentFeedbackValue;
      const newPayload = { ...payload, totalTrustValue: newFeedbackValue };

      await DataModels.feedback.create({ newPayload });
      const resp = await DataModels.userSla.findOne({ _id: id });
      const resp1 = await DataModels.SLA.findOne({
        cloudServiceProvider: response.cloudServiceProvider,
      });
      const QOS =
        resp1.NResourceAvailability * res.ResourceAvailability +
        resp1.NResourceSuccessRate * res.ResourceSuccessRate +
        resp1.NTurnaroundEfficiency * res.TurnaroundEfficiency +
        resp1.NDataIntegrity * res.DataIntegrity;
      let summation = 0.6 * QOS + 0.4 * newFeedbackValue;
      const previousTrustValue = await DataModels.feedback.findOne({
        cloudServiceProvider: response.cloudServiceProvider,
      });
      let count = DataModels.trustValue
        .find({ cloudServiceProvider: response.cloudServiceProvider })
        .countDocuments();
      count = count + 1;
      let newTrustValue = (previousTrustValue + summation) / count;
      const reply = await DataModels.feedback.findOneAndUpdate(
        { cloudServiceProvider: response.cloudServiceProvider },
        { accumulativeTrustValue: newTrustValue },
        { new: true }
      );
      DataModels.SLA.findOneAndUpdate(
        { cloudServiceProvider },
        { trustValue: newTrustValue }
      );
    }
    return reply;
  }
}

module.exports = userSLA;
