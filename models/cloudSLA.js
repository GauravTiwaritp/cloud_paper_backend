const mongoose = require("mongoose");

const slaSchema = new mongoose.Schema({
  cloudServiceProvider: {
    type: String,
    required: true,
  },
  ResourceAvailability: {
    type: Number,
    required: true,
    max: 100,
  },
  NResourceAvailability: {
    type: Number,
  },
  ResourceSuccessRate: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  NResourceSuccessRate: {
    type: Number,
  },
  TurnaroundEfficiency: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  NTurnaroundEfficiency: {
    type: Number,
  },
  DataIntegrity: {
    type: Number,
    required: true,
    min: 0,
    max: 1,
  },
  NDataIntegrity: {
    type: Number,
  },

  cost: {
    type: Number,
    required: true,
    min: 0,
  },
  dataConfidentialityAndIntegrity: {
    type: String,
    required: true,
    enum: ["Enabled", "Disabled"],
  },

  trustValue: {
    type: Number,
  },
});

const minMaxSlaValues = new mongoose.Schema({
  minResourceAvailability: {
    type: Number,
  },
  maxResourceAvailability: {
    type: Number,
  },
  minResourceSuccessRate: {
    type: Number,
  },
  maxResourceSuccessRate: {
    type: Number,
  },
  minTurnaroundEfficiency: {
    type: Number,
  },
  maxTurnaroundEfficiency: {
    type: Number,
  },
  minDataIntegrity: {
    type: Number,
  },
  maxDataIntegrity: {
    type: Number,
  },
});

const SLA = mongoose.model("SLA", slaSchema);
const minMaxSlaValue = mongoose.model("minMaxSlaValue", minMaxSlaValues);

module.exports = { SLA, minMaxSlaValue };
