const express = require('express');
const router = express.Router();

router.get('/', (req, res) => {
  res.json({
    success: true,
    message: 'Cart API is ready',
    data: []
  });
});

router.post('/', (req, res) => {
  res.status(501).json({
    success: false,
    message: 'Cart functionality is not implemented yet'
  });
});

module.exports = router;
