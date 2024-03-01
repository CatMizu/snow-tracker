const { Weather } = require('../models');

async function getAccumulatedSnowfall() {
    const today = new Date();
    today.setHours(0, 0, 0, 0); // 设置为今天的开始时间

    const tomorrow = new Date(today);
    tomorrow.setDate(tomorrow.getDate() + 1); // 获取明天的开始时间，确保包括今天的整天

    const threeDaysAgo = new Date(today);
    threeDaysAgo.setDate(today.getDate() - 2); // 获取前天的开始时间

    try {
        const snowfallData = await Weather.aggregate([
            {
                $match: {
                    date: { $gte: threeDaysAgo, $lt: tomorrow }, // 使用$lt确保不包括明天
                    snow: { $exists: true } // 确保记录有降雪量数据
                }
            },
            {
                $group: {
                    _id: '$skiResort', // 按雪场分组
                    totalSnowfall: { $sum: '$snow' } // 累加每个雪场的降雪量
                }
            },
            {
                $project: {
                    _id: 0,
                    skiResort: '$_id', // 将分组的键作为雪场名返回
                    totalSnowfall: 1 // 返回累积降雪量
                }
            }
        ]);

        return snowfallData;
    } catch (error) {
        console.error('查询累积降雪量时出错:', error);
        throw new Error('数据库查询失败');
    }
}
  module.exports = {
    getAccumulatedSnowfall,
  };