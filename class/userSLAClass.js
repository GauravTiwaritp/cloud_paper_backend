const DataModels = require("../models/index");
const { correlation } = require("node-correlation");
class userSLA {
  async saveUserSlaValue(payload) {
    const result = await DataModels.userSla.create({
      UserName: payload.UserName,
      work: payload.work,
      ResourceAvailability: payload.ResourceAvailability,
      ResourceSuccessRate: payload.ResourceSuccessRate,
      TurnaroundEfficiency: payload.TurnaroundEfficiency,
      DataIntegrity: payload.DataIntegrity,
    });
    return result;
  }

  convertSlaValue(payload) {
    let Total =
      payload.ResourceAvailability +
      payload.ResourceSuccessRate +
      payload.TurnaroundEfficiency +
      payload.DataIntegrity;
    const ResourceAvailability = payload.ResourceAvailability / Total;
    const ResourceSuccessRate = payload.ResourceSuccessRate / Total;
    const TurnaroundEfficiency = payload.TurnaroundEfficiency / Total;
    const DataIntegrity = payload.DataIntegrity / Total;
    console.log(ResourceAvailability);
    const response = {
      UserName: payload.UserName,
      work: payload.work,
      ResourceAvailability: ResourceAvailability,
      ResourceSuccessRate: ResourceSuccessRate,
      TurnaroundEfficiency: TurnaroundEfficiency,
      DataIntegrity: DataIntegrity,
    };
    return response;
  }
  async findUserSlaValue(payload) {
    const result = await DataModels.userSla.findOne({
      UserName: payload.UserName,
      work: payload.work,
    });
    return result;
  }
  async saveUserPreferedCSP(payload) {
    return await DataModels.userPCSP.create({
      UserName: payload.obj.UserName,
      id: payload.obj._id,
    });
  }
  async returnUserPreferedCSP(payload) {
    const result = await DataModels.SLA.findOne(payload._id);
    return result;
  }

  async feedbackInput(payload) {
    const {
      UserName,
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
    const prevFeedbackValue = await DataModels.feedback.find({
      cloudServiceProvider: cloudServiceProvider,
    });

    const feedbackArray = [
      feedbackValueAv,
      feedbackValueSR,
      feedbackValueTE,
      feedbackValueDI,
    ];
    if (totalNumberofRecords == 0) {
      let currentFeedbackValue =
        (feedbackValueAv +
          feedbackValueSR +
          feedbackValueTE +
          feedbackValueDI) /
        40;
      const userSlaReq = await DataModels.userSla.findOne({ _id: id });
      const cloudSlaParam = await DataModels.SLA.findOne({
        cloudServiceProvider: cloudServiceProvider,
      });
      const QOS =
        cloudSlaParam.NResourceAvailability * userSlaReq.ResourceAvailability +
        cloudSlaParam.NResourceSuccessRate * userSlaReq.ResourceSuccessRate +
        cloudSlaParam.NTurnaroundEfficiency * userSlaReq.TurnaroundEfficiency +
        cloudSlaParam.NDataIntegrity * userSlaReq.DataIntegrity;
      let summation = 0.6 * QOS + 0.4 * currentFeedbackValue;
      await DataModels.feedback.create({
        UserName: UserName,
        cloudServiceProvider: cloudServiceProvider,
        feedbackValueAv: feedbackValueAv,
        feedbackValueSR: feedbackValueSR,
        feedbackValueTE: feedbackValueTE,
        feedbackValueDI: feedbackValueDI,
        totalTrustValue: currentFeedbackValue,
      });
      const finalResponse = await DataModels.trustValue.create({
        cloudServiceProvider: cloudServiceProvider,
        accumulativeTrustValue: summation,
      });
      await DataModels.SLA.findOneAndUpdate(
        { cloudServiceProvider },
        { trustValue: newTrustValue }
      );
      return finalResponse;
    }
    let positiveValueCorrelationRecords = 0;
    for (const record of prevFeedbackValue) {
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
    }
    if (positiveValueCorrelationRecords / totalNumberofRecords > 0.5) {
      let currentFeedbackValue =
        (feedbackValueAv +
          feedbackValueSR +
          feedbackValueTE +
          feedbackValueDI) /
        40;
      const aggregationResult = await DataModels.feedback.aggregate([
        {
          $match: { cloudServiceProvider: cloudServiceProvider },
        },
        {
          $project: {
            _id: 0,
            prevFeedbackValue: { $sum: "$totalTrustValue" },
          },
        },
      ]);
      console.log(aggregationResult[0].prevFeedbackValue);
      const newFeedbackValue =
        (1 - positiveValueCorrelationRecords / totalNumberofRecords) *
          aggregationResult[0].prevFeedbackValue +
        (positiveValueCorrelationRecords / totalNumberofRecords) *
          currentFeedbackValue;
      console.log(newFeedbackValue);
      await DataModels.feedback.create({
        UserName: UserName,
        cloudServiceProvider: cloudServiceProvider,
        feedbackValueAv: feedbackValueAv,
        feedbackValueSR: feedbackValueSR,
        feedbackValueTE: feedbackValueTE,
        feedbackValueDI: feedbackValueDI,
        totalTrustValue: newFeedbackValue,
      });
      const userSlaReq = await DataModels.userSla.findOne({ _id: id });
      const cloudSlaParam = await DataModels.SLA.findOne({
        cloudServiceProvider: cloudServiceProvider,
      });
      const QOS =
        cloudSlaParam.NResourceAvailability * userSlaReq.ResourceAvailability +
        cloudSlaParam.NResourceSuccessRate * userSlaReq.ResourceSuccessRate +
        cloudSlaParam.NTurnaroundEfficiency * userSlaReq.TurnaroundEfficiency +
        cloudSlaParam.NDataIntegrity * userSlaReq.DataIntegrity;
      let summation = 0.6 * QOS + 0.4 * newFeedbackValue;
      console.log(summation);
      const previousTrustValue = await DataModels.trustValue.findOne({
        cloudServiceProvider: cloudServiceProvider,
      });
      let count = await DataModels.trustValue
        .find({ cloudServiceProvider: cloudServiceProvider })
        .countDocuments();
      count = count + 1;
      console.log(count);
      console.log(previousTrustValue.accumulativeTrustValue);
      let newTrustValue =
        (previousTrustValue.accumulativeTrustValue + summation) / count;
      console.log(newTrustValue);
      const reply = await DataModels.feedback.findOneAndUpdate(
        { cloudServiceProvider: cloudServiceProvider },
        { totalTrustValue: newTrustValue },
        { new: true }
      );
      const finalResponse = await DataModels.trustValue.findOneAndUpdate(
        { cloudServiceProvider: cloudServiceProvider },
        { accumulativeTrustValue: newTrustValue }
      );
      await DataModels.SLA.findOneAndUpdate(
        { cloudServiceProvider },
        { trustValue: newTrustValue }
      );
      return {
        reply,
      };
    }
    return { reply: "Feedback value cant be inserted as you are a fake user" };
  }
}

module.exports = userSLA;
