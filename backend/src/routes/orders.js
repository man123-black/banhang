const router = require('express').Router();
const ctrl = require('../controllers/orderController');
const auth = require('../middleware/auth');

router.post('/', auth, ctrl.createOrder);
router.get('/my', auth, ctrl.getMyOrders);
router.get('/:id', auth, ctrl.getOrder);
router.put('/:id/cancel', auth, ctrl.cancelOrder);

module.exports = router;
