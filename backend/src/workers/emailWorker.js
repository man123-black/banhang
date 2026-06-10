require('dotenv').config();
const Queue = require('bull');
const nodemailer = require('nodemailer');
const Redis = require('ioredis');

const redis = new Redis(process.env.REDIS_URL || 'redis://redis:6379');
const emailQueue = new Queue('emails', { redis });

const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: +(process.env.SMTP_PORT || 587),
  auth: { user: process.env.SMTP_USER, pass: process.env.SMTP_PASS }
});

emailQueue.process(5, async (job) => {
  const { to, subject, html, text } = job.data;
  await transporter.sendMail({
    from: `"MyShop" <${process.env.SMTP_USER}>`,
    to, subject, html, text
  });
  console.log(`✅ Email sent to ${to}: ${subject}`);
});

emailQueue.on('failed', (job, err) => {
  console.error(`❌ Email failed: ${err.message}`);
});

console.log('👷 Email worker started');
