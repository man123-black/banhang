exports.formatVNPayDate = (date = new Date()) => {
  return date.toISOString().replace(/[-:T.Z]/g, '').slice(0, 14);
};

exports.verifyVNPaySignature = (params, secretKey) => {
  const crypto = require('crypto');
  const querystring = require('querystring');
  const secureHash = params.vnp_SecureHash;
  delete params.vnp_SecureHash;
  delete params.vnp_SecureHashType;
  const sorted = Object.keys(params).sort().reduce((a, k) => { a[k] = params[k]; return a; }, {});
  const signData = querystring.stringify(sorted, { encode: false });
  return crypto.createHmac('sha512', secretKey).update(Buffer.from(signData, 'utf-8')).digest('hex') === secureHash;
};
