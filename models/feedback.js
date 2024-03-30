const mongoose = require("mongoose");

const feedbackSchema = new mongoose.Schema({
  UserName: {
    type: String,
    required: true,
  },
  cloudServiceProvider: {
    type: String,
    required: true,
    enum: ["aws", "gcp", "azure"],
  },
  feedbackValueAv: {
    type: Number,
  },
  feedbackValueSR: {
    type: Number,
  },
  feedbackValueTE: {
    type: Number,
  },
  feedbackValueDI: {
    type: Number,
  },
  totalTrustValue: {
    type: Number,
  },
});

const feedback = mongoose.model("feedback", feedbackSchema);

module.exports = { feedback };
