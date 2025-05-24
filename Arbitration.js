const mongoose = require("mongoose");

const ArbitrationSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Group",
    required: true,
  },
  requester: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  disputeType: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  evidence: [{
    type: String, // Assuming array of file paths or URLs
  }],
  proposedAction: {
    type: String,
  },
  status: {
    type: String,
    enum: ["pending", "reviewing", "resolved", "rejected"],
    default: "pending",
  },
  reviewer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User", // Admin/Supervisor who reviews the case
  },
  resolution: {
    type: String, // The final decision or outcome
  },
  notes: {
    type: String, // Notes from the reviewer
  },
  reviewedAt: {
    type: Date,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
  updatedAt: {
    type: Date,
    default: Date.now,
  },
}, { timestamps: true });

module.exports = mongoose.model("Arbitration", ArbitrationSchema);
