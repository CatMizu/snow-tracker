const express = require('express');
const auth = require('../../middlewares/auth');
const validate = require('../../middlewares/validate');
const snowfallController = require('../../controllers/snowfall.controller');

const router = express.Router();

router
  .route('/')
  .get(auth(), snowfallController.getSnowfall);

module.exports = router;