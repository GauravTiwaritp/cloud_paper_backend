const express = require("express");
const router = express.Router();
const feedbackValidationAndTrustEvaluation = require("../controllers/feedbackController");

router.route("/feedback").post(feedbackValidationAndTrustEvaluation);

module.exports = router;
