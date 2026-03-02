const nodemailer = require('nodemailer');

const createTransporter = () => {
  return nodemailer.createTransport({
    host: process.env.EMAIL_HOST || 'smtp.gmail.com',
    port: Number(process.env.EMAIL_PORT) || 587,
    secure: false,
    auth: {
      user: process.env.EMAIL_USER,
      pass: process.env.EMAIL_PASS,
    },
  });
};

const sendEmail = async ({ to, subject, html, text }) => {
  if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
    console.log('Email service not configured, skipping email:', subject);
    return;
  }
  const transporter = createTransporter();
  await transporter.sendMail({
    from: process.env.EMAIL_FROM || 'CAREERSTIDEZ <noreply@careerstidez.com>',
    to,
    subject,
    html,
    text,
  });
};

module.exports = { sendEmail };
