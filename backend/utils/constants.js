module.exports = {
  BASE_PREMIUM: 100, // Base weekly premium in INR
  
  LOCATION_RISK_MULTIPLIER: {
    low: 0.1,    // +10%
    medium: 0.3, // +30%
    high: 0.5    // +50%
  },
  
  COVERAGE_AMOUNT: 2000, // Weekly coverage in INR
  
  CLAIM_PERCENTAGE: 0.5, // 50% of coverage per claim
  
  DISRUPTION_TYPES: {
    RAIN: 'rain',
    HEATWAVE: 'heatwave',
    MANUAL: 'manual'
  }
};