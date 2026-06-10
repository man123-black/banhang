const nodemailer = require('nodemailer');
const Queue = require('bull');
const { getRedis } = require('../config/redis');

let emailQueue;
let transporter;

const getTransporter = () => {
  if (!transporter) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.gmail.com',
      port: +process.env.SMTP_PORT || 587,
      auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
    });
  }
  return transporter;
};

const getQueue = () => {
  if (!emailQueue) {
    emailQueue = new Queue('emails', { redis: getRedis() });
    emailQueue.process(5, async (job) => {
      await getTransporter().sendMail({
        from: `"MyShop" <${process.env.SMTP_USER}>`,
        ...job.data
      });
    });
  }
  return emailQueue;
};

exports.sendEmail = async ({ to, subject, html, text }) => {
  try {
    await getQueue().add({ to, subject, html, text });
    return { success: true };
  } catch (err) {
    console.error('Email queue error:', err.message);
    return { success: false };
  }
};

exports.sendOrderConfirmation = async (order, user) => {
  const items = order.items.map(i => `<li>${i.name} x${i.qty} - ${i.price.toLocaleString()}đ</li>`).join('');
  await exports.sendEmail({
    to: user.email,
    subject: `[MyShop] Đơn hàng #${order.orderNumber} đã đặt thành công`,
    html: `<h2>Cảm ơn ${user.name}!</h2><p>Đơn hàng #${order.orderNumber}</p><ul>${items}</ul><p><b>Tổng: ${order.totalPrice.toLocaleString()}đ</b></p>`
  });
};
