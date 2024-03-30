const userSLA = require("../class/userSLAClass");

const feedbackValidationAndTrustEvaluation = async (req, res) => {
  const response = await userSLA.feedbackInput(req.body);
  res.json({ data: response });
};

module.exports = feedbackValidationAndTrustEvaluation;
