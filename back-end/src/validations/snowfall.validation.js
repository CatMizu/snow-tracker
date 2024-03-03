const Joi = require('joi');

const getSnowfall = {
  params: Joi.object().keys({
    days: Joi.number().integer().min(1).max(3).required()
      .messages({
        'number.base': 'days must be a number',
        'number.integer': 'days must be an integer',
        'number.min': 'days must be at least 1',
        'number.max': 'days must be less than or equal to 3',
        'any.required': 'days is required'
      })
  })
};

module.exports = {
    getSnowfall,
};
