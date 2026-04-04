const Policy = require('../models/Policy');
const User = require('../models/User');
const premiumService = require('../services/premium.service');

exports.calculatePremium = async (req, res) => {
  try {
    const { userId, city } = req.body;

    if (!userId || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide userId and city'
      });
    }

    // Get user
    let user;
    if (global.inMemoryDB) {
      user = global.inMemoryDB.users.find(u => u._id === userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Calculate premium
    const premiumData = await premiumService.calculatePremium(user.locationRisk, city);

    res.json({
      success: true,
      data: premiumData
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.buyPolicy = async (req, res) => {
  try {
    const { userId, premium, coverageAmount, city } = req.body;

    if (!userId || !premium || !coverageAmount || !city) {
      return res.status(400).json({
        success: false,
        message: 'Please provide all required fields'
      });
    }

    // Get user
    let user;
    if (global.inMemoryDB) {
      user = global.inMemoryDB.users.find(u => u._id === userId);
    } else {
      user = await User.findById(userId);
    }

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const startDate = new Date();
    const endDate = new Date();
    endDate.setDate(endDate.getDate() + 7); // 7-day policy

    const premiumBreakdown = await premiumService.calculatePremium(user.locationRisk, city);

    if (global.inMemoryDB) {
      const policy = {
        _id: Date.now().toString(),
        userId,
        premium,
        coverageAmount,
        startDate,
        endDate,
        status: 'active',
        city,
        premiumBreakdown,
        createdAt: new Date()
      };

      global.inMemoryDB.policies.push(policy);

      return res.status(201).json({
        success: true,
        message: 'Policy activated successfully',
        data: policy
      });
    }

    const policy = await Policy.create({
      userId,
      premium,
      coverageAmount,
      startDate,
      endDate,
      status: 'active',
      city,
      premiumBreakdown
    });

    res.status(201).json({
      success: true,
      message: 'Policy activated successfully',
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getUserPolicies = async (req, res) => {
  try {
    const { userId } = req.params;

    if (global.inMemoryDB) {
      const policies = global.inMemoryDB.policies.filter(p => p.userId === userId);
      return res.json({
        success: true,
        data: policies
      });
    }

    const policies = await Policy.find({ userId }).sort({ createdAt: -1 });

    res.json({
      success: true,
      data: policies
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};

exports.getPolicy = async (req, res) => {
  try {
    const { policyId } = req.params;

    if (global.inMemoryDB) {
      const policy = global.inMemoryDB.policies.find(p => p._id === policyId);
      if (!policy) {
        return res.status(404).json({
          success: false,
          message: 'Policy not found'
        });
      }
      return res.json({ success: true, data: policy });
    }

    const policy = await Policy.findById(policyId);
    if (!policy) {
      return res.status(404).json({
        success: false,
        message: 'Policy not found'
      });
    }

    res.json({
      success: true,
      data: policy
    });
  } catch (error) {
    res.status(500).json({
      success: false,
      message: error.message
    });
  }
};