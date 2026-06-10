const router = require('express').Router();
const ctrl = require('../controllers/notificationController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', auth, ctrl.getMy);
router.put('/read', auth, ctrl.markAsRead);
router.put('/:id/read', auth, ctrl.markOneAsRead);
router.post('/broadcast', auth, adminAuth, ctrl.broadcast);

module.exports = router;
