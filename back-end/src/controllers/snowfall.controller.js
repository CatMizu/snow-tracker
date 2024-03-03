const httpStatus = require('http-status');
const catchAsync = require('../utils/catchAsync');
const { snowfallService } = require('../services');


const getSnowfall = catchAsync(async (req, res) => {
  const snowfallData = await snowfallService.getAccumulatedSnowfallbyDays(req.params.days);
  res.send({ snowfallData });
});


module.exports = {
    getSnowfall,
};
