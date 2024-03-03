const { Weather } = require('../models');

async function getAccumulatedSnowfallbyDays(days) {
    const today = new Date();
    today.setHours(0, 0, 0, 0);

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1);

    const startingDate = new Date(today);
    startingDate.setDate(today.getDate() - (days - 1));

    try {
        const snowfallData = await Weather.aggregate([
            {
                $match: {
                    date: { $gte: startingDate, $lt: tomorrow }, 
                    snow: { $exists: true }
                }
            },
            {
                $group: {
                    _id: '$skiResort',
                    totalSnowfall: { $sum: '$snow' }
                }
            },
            {
                $project: {
                    _id: 0,
                    skiResort: '$_id',
                    totalSnowfall: { $round: ["$totalSnowfall", 2] }
                }
            }
        ]);

        return snowfallData;
    } catch (error) {
        console.error('Error occurred while querying cumulative snowfall:', error);
        throw new Error('Database query failed');
    }
}
  module.exports = {
    getAccumulatedSnowfallbyDays,
  };