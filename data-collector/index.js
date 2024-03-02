require('dotenv').config();
const axios = require('axios');
const cron = require('node-cron');
const mongoose = require('mongoose');
const Weather = require('./Model/Weather');

const skiResorts = [
    { name: "Mount St. Louis Moonstone", lat: 44.627646811582956, lon: -79.66979378714234 },
    { name: "Cypress", lat: 49.396668769956726, lon: -123.20178304743474 },
    { name: "Whistler Mountain", lat: 50.060730231132844, lon: -122.9485507882357 },
    { name: "Mont-Tremblant", lat: 46.21745308838467, lon: -74.55830619765786 },
    { name: "Big White", lat: 49.73174913248634, lon: -118.94290766872224 },
    { name: "Blue Mountain", lat: 44.50120855842563, lon: -80.31609970249248 }
];

mongoose.connect(process.env.MONGODB_URL);
const db = mongoose.connection;
db.on('error', console.error.bind(console, 'MongoDB连接错误:'));

async function fetchWeatherData(lat, lon) {
    const url = `http://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${lon}&exclude=minutely,hourly,alerts&appid=${process.env.OPENWEATHER_API_KEY}&units=metric`;
    try {
      const response = await axios.get(url);
      return response.data;
    } catch (error) {
      console.error('获取天气数据时出错:', error);
      return null;
    }
  }
  

// 保存天气数据到数据库的函数
async function saveWeatherData(data, skiResortName) {
    const dailyData = data.daily[0];
    const weatherData = new Weather({
      date: new Date(dailyData.dt * 1000),
      skiResort: skiResortName,
      temp: dailyData.temp,
      feels_like: dailyData.feels_like,
      pressure: dailyData.pressure,
      humidity: dailyData.humidity,
      dew_point: dailyData.dew_point,
      wind_speed: dailyData.wind_speed,
      wind_deg: dailyData.wind_deg,
      weather: dailyData.weather,
      clouds: dailyData.clouds,
      pop: dailyData.pop,
      rain: dailyData.rain || 0,
      snow: dailyData.snow || 0,
      uvi: dailyData.uvi
    });
  
    try {
      await weatherData.save();
      console.log('天气数据已保存到数据库');
    } catch (error) {
      console.error('保存天气数据时出错:', error);
    }
  }

  async function fetchAndSaveSkiResortsData() {
    for (const resort of skiResorts) {
        try {
            const weatherData = await fetchWeatherData(resort.lat, resort.lon);
            if (weatherData) {
                await saveWeatherData(weatherData, resort.name);
            } else {
                console.log(`未能获取${resort.name}的天气数据`);
            }
        } catch (error) {
            console.error(`处理${resort.name}的天气数据时出错:`, error);
        }
    }
}


cron.schedule('0 0 6 * * *', async () => {
  await fetchAndSaveSkiResortsData();
});
console.log('Cron job started...');