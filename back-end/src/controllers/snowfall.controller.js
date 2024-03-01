const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { snowfallService } = require('../services');


const getSnowfall = catchAsync(async (req, res) => {
  const snowfallData = await snowfallService.getAccumulatedSnowfall();
  res.send({ snowfallData });
});


module.exports = {
    getSnowfall,
};
