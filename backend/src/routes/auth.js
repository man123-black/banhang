const router = require('express').Router();
const ctrl = require('../controllers/authController');
const auth = require('../middleware/auth');
const { authLimiter } = require('../middleware/rateLimit');
const { registerValidator, loginValidator } = require('../validators/authValidator');

router.post('/register', authLimiter, registerValidator, ctrl.register);
router.post('/login', authLimiter, loginValidator, ctrl.login);
router.post('/forgot-password', ctrl.forgotPassword);
router.get('/profile', auth, ctrl.getProfile);
router.put('/profile', auth, ctrl.updateProfile);
router.put('/change-password', auth, ctrl.changePassword);

module.exports = router;
