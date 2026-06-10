const Redis = require('ioredis');
let redis;

module.exports.initRedis = () => {
  redis = new Redis(process.env.REDIS_URL);
  redis.on('connect', () => console.log('✅ Redis connected'));
  redis.on('error', (err) => console.error('❌ Redis error:', err.message));
};

module.exports.getRedis = () => redis;

module.exports.cache = (duration = 300) => async (req, res, next) => {
  if (!redis) return next();
  const key = `cache:${req.originalUrl}`;
  try {
    const cached = await redis.get(key);
    if (cached) return res.json(JSON.parse(cached));
    res.originalJson = res.json;
    res.json = (data) => {
      redis.setex(key, duration, JSON.stringify(data));
      res.originalJson(data);
    };
  } catch (err) { /* ignore cache errors */ }
  next();
};
