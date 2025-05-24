const mongoose = require('mongoose');

const FreelancerApplicationSchema = new mongoose.Schema({
  group: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Group',
    required: true
  },
  freelancer: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  description: {
    type: String,
    required: true
  },
  timeline: {
    type: String,
    required: true
  },
  budget: {
    type: Number,
    required: true
  },
  currency: {
    type: String,
    default: 'USD'
  },
  attachments: [{
    type: String
  }],
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  },
  createdAt: {
    type: Date,
    default: Date.now
  },
  updatedAt: {
    type: Date,
    default: Date.now
  }
}, { timestamps: true });

module.exports = mongoose.model('FreelancerApplication', FreelancerApplicationSchema);
