const weatherService = require('./weather.service');
const { BASE_PREMIUM, LOCATION_RISK_MULTIPLIER, COVERAGE_AMOUNT } = require('../utils/constants');

class PremiumService {
  async calculatePremium(locationRisk, city) {
    // Base premium
    let premium = BASE_PREMIUM;

    // Location risk premium
    const locationRiskPremium = BASE_PREMIUM * LOCATION_RISK_MULTIPLIER[locationRisk];
    premium += locationRiskPremium;

    // Weather risk premium
    const weatherData = await weatherService.getWeatherData(city);
    const weatherRisk = weatherService.calculateWeatherRisk(weatherData);
    const weatherRiskPremium = (BASE_PREMIUM * weatherRisk) / 100;
    premium += weatherRiskPremium;

    return {
      totalPremium: Math.round(premium),
      breakdown: {
        basePremium: BASE_PREMIUM,
        locationRiskPremium: Math.round(locationRiskPremium),
        weatherRiskPremium: Math.round(weatherRiskPremium)
      },
      coverageAmount: COVERAGE_AMOUNT,
      weatherData: {
        temperature: weatherData.temperature,
        condition: weatherData.condition,
        riskScore: weatherRisk
      }
    };
  }
}

module.exports = new PremiumService();