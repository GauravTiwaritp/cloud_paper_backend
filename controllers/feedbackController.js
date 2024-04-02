const userSLA = require("../class/userSLAClass");
const userSla = new userSLA();
const feedbackValidationAndTrustEvaluation = async (req, res) => {
  const response = await userSla.feedbackInput(req.body);
  res.json({ data: response });
};

module.exports = feedbackValidationAndTrustEvaluation;
