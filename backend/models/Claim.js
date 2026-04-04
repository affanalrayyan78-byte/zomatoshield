const mongoose = require('mongoose');

const claimSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  policyId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Policy',
    required: true
  },
  disruptionType: {
    type: String,
    enum: ['rain', 'heatwave', 'manual'],
    required: true
  },
  amount: {
    type: Number,
    required: true
  },
  status: {
    type: String,
    enum: ['pending', 'approved', 'rejected', 'paid'],
    default: 'pending'
  },
  weatherData: {
    temperature: Number,
    condition: String,
    description: String
  },
  fraudCheckPassed: {
    type: Boolean,
    default: true
  },
  rejectionReason: {
    type: String,
    default: null
  },
  payoutTransactionId: {
    type: String,
    default: null
  },
  triggeredAt: {
    type: Date,
    default: Date.now
  },
  processedAt: {
    type: Date,
    default: null
  }
});

module.exports = mongoose.model('Claim', claimSchema);