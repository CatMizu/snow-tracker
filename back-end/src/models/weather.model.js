const mongoose = require('mongoose');

const weatherSchema = new mongoose.Schema({
  date: {
    type: Date,
    required: true
  },
  skiResort: {
    type: String,
    required: true
  },
  temp: {
    min: Number,
    max: Number,
    morning: Number,
    day: Number,
    evening: Number,
    night: Number
  },
  feels_like: {
    day: Number,
    night: Number,
    evening: Number,
    morning: Number
  },
  pressure: Number,
  humidity: Number,
  dew_point: Number,
  wind_speed: Number,
  wind_deg: Number,
  weather: [{
    id: Number,
    main: String,
    description: String,
    icon: String
  }],
  clouds: Number,
  pop: Number,
  rain: Number,
  snow: Number,
  uvi: Number
}, { timestamps: true });

weatherSchema.index({ date: 1, skiResort: 1 }, { unique: true });

const Weather = mongoose.model('Weather', weatherSchema);

module.exports = Weather;
