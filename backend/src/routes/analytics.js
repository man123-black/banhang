const router = require('express').Router();
const ctrl = require('../controllers/analyticsController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/track', ctrl.trackEvent);
router.get('/overview', auth, adminAuth, ctrl.getOverview);
router.get('/revenue', auth, adminAuth, ctrl.getRevenueByDate);

module.exports = router;
