const router = require('express').Router();
const ctrl = require('../controllers/categoryController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/', ctrl.getAll);
router.get('/:id', ctrl.getById);
router.post('/', auth, adminAuth, ctrl.create);
router.put('/:id', auth, adminAuth, ctrl.update);
router.delete('/:id', auth, adminAuth, ctrl.remove);

module.exports = router;
