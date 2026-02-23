const crypto = require('node:crypto');
const {sendOtpEmail} = require('./mailer');

const OTP_TTL = 2 * 60 * 1000; // 2 minutes

const registerOtpStore = new Map(); // email -> { otp, userData, expiresAt }
const loginOtpStore = new Map(); // email -> { otp, expiresAt }

async function sendOtp(store, email, extraData = {}) {
  const otp = crypto.randomBytes(3).toString('hex').toUpperCase();
  store.set(email, {...extraData, otp, expiresAt: Date.now() + OTP_TTL});
  await sendOtpEmail(email, otp);
}

function consumeOtp(store, email, otp) {
  const record = store.get(email);

  if (!record || Date.now() > record.expiresAt) {
    store.delete(email);
    const err = new Error('OTP expired or not found');
    err.name = 'UnauthorizedError';
    throw err;
  }

  if (record.otp !== otp) {
    const err = new Error('Invalid OTP');
    err.name = 'UnauthorizedError';
    throw err;
  }

  store.delete(email);
  return record;
}

module.exports = {registerOtpStore, loginOtpStore, sendOtp, consumeOtp};
