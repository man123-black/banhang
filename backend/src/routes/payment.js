const router = require('express').Router();
const ctrl = require('../controllers/paymentController');
const auth = require('../middleware/auth');

router.post('/vnpay', auth, ctrl.createVNPay);
router.get('/vnpay/callback', ctrl.vnpayCallback);
router.post('/momo', auth, ctrl.createMomo);

module.exports = router;
