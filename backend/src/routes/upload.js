const router = require('express').Router();
const auth = require('../middleware/auth');
const adminAuth = require('../middleware/adminAuth');
const upload = require('../middleware/upload');
const ctrl = require('../controllers/uploadController');

router.post('/image', auth, adminAuth, upload.single('image'), ctrl.uploadImage);
router.post('/images', auth, adminAuth, upload.array('images', 10), ctrl.uploadMultiple);

module.exports = router;
