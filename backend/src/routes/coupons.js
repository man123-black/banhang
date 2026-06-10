const router = require('express').Router();
const ctrl = require('../controllers/couponController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.post('/validate', ctrl.validate);
router.get('/', auth, adminAuth, ctrl.getAll);
router.post('/', auth, adminAuth, ctrl.create);
router.put('/:id', auth, adminAuth, ctrl.update);
router.delete('/:id', auth, adminAuth, ctrl.remove);

module.exports = router;
