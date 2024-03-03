const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const snowfallValidation = require('../../validations/snowfall.validation');
const snowfallController = require('../../controllers/snowfall.controller');

const router = express.Router();

router
  .route('/:days')
  .get(auth(), validate(snowfallValidation.getSnowfall), snowfallController.getSnowfall);

module.exports = router;