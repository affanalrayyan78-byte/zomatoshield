const mongoose = require('mongoose');

const policySchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  premium: {
    type: Number,
    required: true
  },
  coverageAmount: {
    type: Number,
    required: true
  },
  startDate: {
    type: Date,
    required: true
  },
  endDate: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    enum: ['active', 'expired', 'cancelled'],
    default: 'active'
  },
  city: {
    type: String,
    required: true
  },
  premiumBreakdown: {
    basePremium: Number,
    locationRiskPremium: Number,
    weatherRiskPremium: Number
  },
  createdAt: {
    type: Date,
    default: Date.now
  }
});

module.exports = mongoose.model('Policy', policySchema);