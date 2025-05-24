const mongoose = require('mongoose');

const GroupSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true,
    trim: true
  },
  description: {
    type: String,
    required: true
  },
  creator: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  sector: {
    type: String,
    required: true
  },
  country: {
    type: String,
    required: true
  },
  expectedMembers: {
    type: Number,
    required: true
  },
  resourceType: {
    type: String,
    required: true
  },
  members: [{
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User'
    },
    role: {
      type: String,
      enum: ['creator', 'member', 'admin'],
      default: 'member'
    },
    joinedAt: {
      type: Date,
      default: Date.now
    }
  }],
  status: {
    type: String,
    enum: ['pending_approval', 'approved', 'rejected', 'active', 'closed', 'frozen'],
    default: 'pending_approval'
  },
  supplierOffers: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'SupplierOffer'
  }],
  freelancerApplications: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'FreelancerApplication'
  }],
  votingActive: {
    type: Boolean,
    default: false
  },
  arbitrationActive: {
    type: Boolean,
    default: false
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

module.exports = mongoose.model('Group', GroupSchema);
