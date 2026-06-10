const router = require('express').Router();
const Banner = require('../models/Banner');

router.get('/', async (req, res) => {
  const { position } = req.query;
  const query = { isActive: true };
  if (position) query.position = position;
  const banners = await Banner.find(query).sort({ order: 1 });
  res.json(banners);
});

router.post('/', async (req, res) => {
  const banner = await Banner.create(req.body);
  res.status(201).json(banner);
});

module.exports = router;
