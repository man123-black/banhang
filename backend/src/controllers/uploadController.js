const cloudinary = require('../config/cloudinary');

exports.uploadImage = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ message: 'Không có file' });
    const b64 = Buffer.from(req.file.buffer).toString('base64');
    const dataURI = `data:${req.file.mimetype};base64,${b64}`;
    const result = await cloudinary.uploader.upload(dataURI, {
      folder: 'myshop/products',
      transformation: [{ width: 1000, height: 1000, crop: 'limit' }, { quality: 'auto' }]
    });
    res.json({ url: result.secure_url, public_id: result.public_id });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.uploadMultiple = async (req, res) => {
  try {
    if (!req.files || !req.files.length) return res.status(400).json({ message: 'Không có file' });
    const uploadPromises = req.files.map(file => {
      const b64 = Buffer.from(file.buffer).toString('base64');
      const dataURI = `data:${file.mimetype};base64,${b64}`;
      return cloudinary.uploader.upload(dataURI, { folder: 'myshop/products' });
    });
    const results = await Promise.all(uploadPromises);
    res.json({ images: results.map(r => ({ url: r.secure_url, public_id: r.public_id })) });
  } catch (err) { res.status(500).json({ message: err.message }); }
};
