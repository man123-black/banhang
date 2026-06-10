const { getRedis } = require('../config/redis');

module.exports = (duration = 300) => async (req, res, next) => {
  if (req.method !== 'GET') return next();
  const redis = getRedis();
  if (!redis) return next();
  const key = `cache:${req.originalUrl}`;
  try {
    const cached = await redis.get(key);
    if (cached) {
      res.set('X-Cache', 'HIT');
      return res.json(JSON.parse(cached));
    }
    res.originalJson = res.json;
    res.json = (data) => {
      redis.setex(key, duration, JSON.stringify(data));
      res.set('X-Cache', 'MISS');
      res.originalJson(data);
    };
  } catch (err) { /* ignore */ }
  next();
};
