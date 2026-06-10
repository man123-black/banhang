require('dotenv').config();
const Queue = require('bull');
const Redis = require('ioredis');
const mongoose = require('mongoose');
const Analytics = require('../models/Analytics');

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
const analyticsQueue = new Queue('analytics', { redis });

mongoose.connect(process.env.MONGO_URI || 'mongodb://mongo:27017/ecommerce').then(() => {
  console.log('✅ Analytics worker connected to MongoDB');
});

analyticsQueue.process(20, async (job) => {
  const data = job.data;
  await Analytics.create({
    type: data.type,
    user: data.userId,
    product: data.productId,
    category: data.categoryId,
    searchQuery: data.searchQuery,
    value: data.value,
    sessionId: data.sessionId,
    ip: data.ip,
    userAgent: data.userAgent,
    metadata: data.metadata
  });
});

analyticsQueue.on('failed', (job, err) => {
  console.error(`❌ Analytics failed: ${err.message}`);
});

console.log('📊 Analytics worker started');
