const crypto = require('crypto');
const querystring = require('querystring');
const Order = require('../models/Order');

exports.createVNPay = (req, res) => {
  try {
    const { orderId, amount, bankCode, orderInfo } = req.body;
    const tmnCode = process.env.VNPAY_TMN_CODE || 'DEMOTMN';
    const secretKey = process.env.VNPAY_HASH_SECRET || 'DEMOHASH';
    const vnpUrl = 'https://sandbox.vnpayment.vn/paymentv2/vpcpay.html';
    const returnUrl = `${req.protocol}://${req.get('host')}/api/payment/vnpay/callback`;
    const date = new Date();
    const createDate = date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
    const vnpParams = {
      vnp_Version: '2.1.0',
      vnp_Command: 'pay',
      vnp_TmnCode: tmnCode,
      vnp_Locale: 'vn',
      vnp_CurrCode: 'VND',
      vnp_TxnRef: orderId,
      vnp_OrderInfo: orderInfo || `Thanh toan don hang ${orderId}`,
      vnp_OrderType: 'billpayment',
      vnp_Amount: amount * 100,
      vnp_ReturnUrl: returnUrl,
      vnp_IpAddr: req.ip,
      vnp_CreateDate: createDate
    };
    if (bankCode) vnpParams.vnp_BankCode = bankCode;
    const sorted = Object.keys(vnpParams).sort().reduce((a, k) => { a[k] = vnpParams[k]; return a; }, {});
    const signData = querystring.stringify(sorted, { encode: false });
    const signed = crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex');
    vnpParams.vnp_SecureHash = signed;
    res.json({ paymentUrl: `${vnpUrl}?${querystring.stringify(vnpParams, { encode: false })}` });
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.vnpayCallback = async (req, res) => {
  try {
    const vnpParams = req.query;
    const secureHash = vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHash;
    delete vnpParams.vnp_SecureHashType;
    const sorted = Object.keys(vnpParams).sort().reduce((a, k) => { a[k] = vnpParams[k]; return a; }, {});
    const signData = querystring.stringify(sorted, { encode: false });
    const signed = crypto.createHmac('sha512', process.env.VNPAY_HASH_SECRET || 'DEMOHASH').update(Buffer.from(signData, 'utf-8')).digest('hex');
    if (secureHash === signed) {
      const order = await Order.findById(vnpParams.vnp_TxnRef);
      if (order && vnpParams.vnp_ResponseCode === '00') {
        order.isPaid = true;
        order.paidAt = new Date();
        order.paymentResult = { id: vnpParams.vnp_TransactionNo, status: 'success', update_time: new Date().toISOString() };
        await order.save();
      }
      res.json({ code: vnpParams.vnp_ResponseCode, message: 'OK' });
    } else {
      res.status(400).json({ message: 'Invalid signature' });
    }
  } catch (err) { res.status(500).json({ message: err.message }); }
};

exports.createMomo = async (req, res) => {
  res.json({ message: 'MoMo payment (demo)', payUrl: 'https://test.momo.vn' });
};
