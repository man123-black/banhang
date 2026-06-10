const router = require('express').Router();
const ctrl = require('../controllers/reviewController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/product/:productId', ctrl.getByProduct);
router.get('/', auth, adminAuth, ctrl.getAll);
router.post('/', auth, ctrl.create);
router.delete('/:id', auth, adminAuth, ctrl.remove);

module.exports = router;
