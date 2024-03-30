const mongoose = require("mongoose");

const trustSchema = new mongoose.Schema({
  cloudServiceProvider: {
    type: String,
  },
  accumulativeTrustValue: {
    type: Number,
  },
});

const trustValue = mongoose.model("trustValue", trustSchema);

module.exports = trustValue;
