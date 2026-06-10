const router = require('express').Router();
const ctrl = require('../controllers/userController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', auth, adminAuth, ctrl.getAll);
router.get('/:id', auth, adminAuth, ctrl.getById);
router.put('/:id', auth, adminAuth, ctrl.update);
router.put('/:id/toggle-block', auth, adminAuth, ctrl.toggleBlock);
router.delete('/:id', auth, adminAuth, ctrl.remove);

module.exports = router;
