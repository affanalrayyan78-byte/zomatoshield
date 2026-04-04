const axios = require('axios');

const OPENWEATHER_API_KEY = process.env.OPENWEATHER_API_KEY;
const OPENWEATHER_BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

class WeatherService {
  async getWeatherData(city) {
    try {
      if (!OPENWEATHER_API_KEY || OPENWEATHER_API_KEY === 'your_openweather_api_key_here') {
        // Return mock data if API key not configured
        console.log('⚠️  Using mock weather data - configure OPENWEATHER_API_KEY for real data');
        return this.getMockWeatherData(city);
      }

      const response = await axios.get(OPENWEATHER_BASE_URL, {
        params: {
          q: city,
          appid: OPENWEATHER_API_KEY,
          units: 'metric'
        }
      });

      const data = response.data;

      return {
        temperature: data.main.temp,
        condition: data.weather[0].main,
        description: data.weather[0].description,
        humidity: data.main.humidity,
        pressure: data.main.pressure
      };
    } catch (error) {
      console.error('Weather API Error:', error.message);
      // Fallback to mock data on error
      return this.getMockWeatherData(city);
    }
  }

  getMockWeatherData(city) {
    // Simulate different weather conditions
    const conditions = ['Clear', 'Rain', 'Clouds', 'Haze'];
    const randomCondition = conditions[Math.floor(Math.random() * conditions.length)];
    const randomTemp = 25 + Math.random() * 15; // 25-40°C

    return {
      temperature: parseFloat(randomTemp.toFixed(1)),
      condition: randomCondition,
      description: randomCondition.toLowerCase(),
      humidity: 60 + Math.random() * 30,
      pressure: 1010 + Math.random() * 20
    };
  }

  isRaining(weatherData) {
    return weatherData.condition === 'Rain' || 
           weatherData.description.includes('rain') ||
           weatherData.description.includes('drizzle');
  }

  isHeatwave(weatherData) {
    return weatherData.temperature > 35;
  }

  calculateWeatherRisk(weatherData) {
    let risk = 0;

    if (this.isRaining(weatherData)) {
      risk += 30;
    }

    if (this.isHeatwave(weatherData)) {
      risk += 25;
    }

    if (weatherData.humidity > 80) {
      risk += 10;
    }

    return Math.min(risk, 50); // Cap at 50
  }
}

module.exports = new WeatherService();