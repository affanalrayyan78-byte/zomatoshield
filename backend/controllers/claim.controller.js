const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const triggerService = require('../services/trigger.service');

exports.triggerClaim = async (req, res) => {
  try {
    const { userId, disruptionType } = req.body;

    if (!userId || !disruptionType) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and disruptionType'
      });
    }

    // Get active policy
    let policy;
    if (global.inMemoryDB) {
      policy = global.inMemoryDB.policies.find(
        p => p.userId === userId && p.status === 'active'
      );
    } else {
      policy = await Policy.findOne({ userId, status: 'active' });
    }

    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'No active policy found for this user'
      });
    }

    // Process claim
    const claim = await triggerService.processClaim(policy, disruptionType);

    res.status(201).json({
      success: true,
      message: claim.status === 'approved' ? 'Claim approved and payout initiated' : 'Claim rejected',
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserClaims = async (req, res) => {
  try {
    const { userId } = req.params;

    if (global.inMemoryDB) {
      const claims = global.inMemoryDB.claims.filter(c => c.userId === userId);
      return res.json({
        success: true,
        data: claims
      });
    }

    const claims = await Claim.find({ userId })
      .populate('policyId')
      .sort({ triggeredAt: -1 });

    res.json({
      success: true,
      data: claims
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getClaim = async (req, res) => {
  try {
    const { claimId } = req.params;

    if (global.inMemoryDB) {
      const claim = global.inMemoryDB.claims.find(c => c._id === claimId);
      if (!claim) {
        return res.status(404).json({
          success: false,
          message: 'Claim not found'
        });
      }
      return res.json({ success: true, data: claim });
    }

    const claim = await Claim.findById(claimId).populate('policyId');
    if (!claim) {
      return res.status(404).json({
        success: false,
        message: 'Claim not found'
      });
    }

    res.json({
      success: true,
      data: claim
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};