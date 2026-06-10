const { body } = require('express-validator');

exports.productValidator = [
  body('name').trim().notEmpty().isLength({ max: 200 }),
  body('price').isFloat({ min: 0 }).withMessage('Giá phải là số dương'),
  body('stock').isInt({ min: 0 }),
  body('category').isMongoId()
];
