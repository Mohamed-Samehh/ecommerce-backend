const process = require('node:process');
const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  host: process.env.EMAIL_HOST,
  port: Number(process.env.EMAIL_PORT) || 587,
  secure: Number(process.env.EMAIL_PORT) === 465,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS
  }
});

exports.sendOtpEmail = async (to, otp) => {
  // English comment: If no email host is configured, log the OTP to the console for development
  if (!process.env.EMAIL_HOST) {
    console.log('-----------------------------------------');
    console.log(`[DEV] OTP for ${to}: ${otp}`);
    console.log('-----------------------------------------');
    return;
  }

  await transporter.sendMail({
    from: `"${process.env.EMAIL_FROM_NAME}" <${process.env.EMAIL_FROM}>`,
    to,
    subject: 'Your Registration OTP',
    text: `Your OTP is: ${otp}\n\nIt expires in 2 minutes.`
  });
};
