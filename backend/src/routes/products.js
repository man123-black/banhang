const router = require('express').Router();
const ctrl = require('../controllers/productController');
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');

router.get('/featured', ctrl.getFeatured);
router.get('/', ctrl.getProducts);
router.get('/:id', ctrl.getProduct);
router.post('/', auth, adminAuth, ctrl.createProduct);
router.put('/:id', auth, adminAuth, ctrl.updateProduct);
router.delete('/:id', auth, adminAuth, ctrl.deleteProduct);

module.exports = router;
