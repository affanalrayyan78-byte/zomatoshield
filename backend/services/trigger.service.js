const Claim = require('../models/Claim');
const Policy = require('../models/Policy');
const weatherService = require('./weather.service');
const payoutService = require('./payout.service');

class TriggerService {
  async processClaim(policy, disruptionType) {
    try {
      // Get current weather data
      const weatherData = await weatherService.getWeatherData(policy.city);

      // Fraud detection
      const fraudCheck = this.performFraudCheck(disruptionType, weatherData, policy);

      if (!fraudCheck.passed) {
        return this.createRejectedClaim(policy, disruptionType, weatherData, fraudCheck.reason);
      }

      // Calculate claim amount (50% of coverage)
      const claimAmount = Math.round(policy.coverageAmount * 0.5);

      // Create claim
      const claim = await this.createClaim(policy, disruptionType, weatherData, claimAmount);

      // Process payout
      const payout = await payoutService.processUPIPayout(policy.userId, claimAmount);

      // Update claim with payout info
      claim.status = 'paid';
      claim.payoutTransactionId = payout.transactionId;
      claim.processedAt = new Date();

      if (global.inMemoryDB) {
        const index = global.inMemoryDB.claims.findIndex(c => c._id === claim._id);
        if (index !== -1) {
          global.inMemoryDB.claims[index] = claim;
        }
      } else {
        await Claim.findByIdAndUpdate(claim._id, {
          status: 'paid',
          payoutTransactionId: payout.transactionId,
          processedAt: new Date()
        });
      }

      return claim;
    } catch (error) {
      console.error('Process claim error:', error.message);
      throw error;
    }
  }

  performFraudCheck(disruptionType, weatherData, policy) {
    // Check 1: Rain claim but no rain detected
    if (disruptionType === 'rain' && !weatherService.isRaining(weatherData)) {
      return {
        passed: false,
        reason: 'No rain detected in the area'
      };
    }

    // Check 2: Heatwave claim but temperature not high enough
    if (disruptionType === 'heatwave' && !weatherService.isHeatwave(weatherData)) {
      return {
        passed: false,
        reason: 'Temperature below heatwave threshold (35°C)'
      };
    }

    // Check 3: Check for excessive claims (more than 3 per policy)
    let claimCount;
    if (global.inMemoryDB) {
      claimCount = global.inMemoryDB.claims.filter(
        c => c.policyId === policy._id && c.status === 'paid'
      ).length;
    } else {
      // This would need to be async in real implementation
      claimCount = 0; // Simplified for now
    }

    if (claimCount >= 3) {
      return {
        passed: false,
        reason: 'Maximum claim limit reached for this policy'
      };
    }

    return { passed: true };
  }

  async createClaim(policy, disruptionType, weatherData, amount) {
    const claimData = {
      userId: policy.userId,
      policyId: policy._id,
      disruptionType,
      amount,
      status: 'approved',
      weatherData: {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        description: weatherData.description
      },
      fraudCheckPassed: true,
      triggeredAt: new Date()
    };

    if (global.inMemoryDB) {
      const claim = {
        _id: Date.now().toString(),
        ...claimData
      };
      global.inMemoryDB.claims.push(claim);
      return claim;
    }

    const claim = await Claim.create(claimData);
    return claim;
  }

  async createRejectedClaim(policy, disruptionType, weatherData, reason) {
    const claimData = {
      userId: policy.userId,
      policyId: policy._id,
      disruptionType,
      amount: 0,
      status: 'rejected',
      weatherData: {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        description: weatherData.description
      },
      fraudCheckPassed: false,
      rejectionReason: reason,
      triggeredAt: new Date()
    };

    if (global.inMemoryDB) {
      const claim = {
        _id: Date.now().toString(),
        ...claimData
      };
      global.inMemoryDB.claims.push(claim);
      return claim;
    }

    const claim = await Claim.create(claimData);
    return claim;
  }

  async checkAllActivePolicies() {
    console.log('🔍 Checking all active policies for automated triggers...');

    let activePolicies;
    if (global.inMemoryDB) {
      activePolicies = global.inMemoryDB.policies.filter(p => p.status === 'active');
    } else {
      activePolicies = await Policy.find({ status: 'active' });
    }

    for (const policy of activePolicies) {
      try {
        const weatherData = await weatherService.getWeatherData(policy.city);

        // Check for rain trigger
        if (weatherService.isRaining(weatherData)) {
          console.log(`☔ Rain detected for policy ${policy._id} in ${policy.city}`);
          await this.processClaim(policy, 'rain');
        }

        // Check for heatwave trigger
        if (weatherService.isHeatwave(weatherData)) {
          console.log(`🌡️ Heatwave detected for policy ${policy._id} in ${policy.city}`);
          await this.processClaim(policy, 'heatwave');
        }
      } catch (error) {
        console.error(`Error processing policy ${policy._id}:`, error.message);
      }
    }
  }
}

module.exports = new TriggerService();