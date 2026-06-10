const router = require('express').Router();
const ctrl = require('../controllers/adminController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/dashboard', auth, adminAuth, ctrl.getDashboard);
router.get('/orders', auth, adminAuth, ctrl.getAllOrders);
router.get('/orders/:id', auth, adminAuth, ctrl.getOrderDetail);
router.put('/orders/:id/status', auth, adminAuth, ctrl.updateOrderStatus);

module.exports = router;
