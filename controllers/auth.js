const asyncHandler = require('../middleware/async-handler');
const User = require('../models/user');
const {signToken} = require('../utils/jwt');
const {registerOtpStore, loginOtpStore, sendOtp, consumeOtp} = require('../utils/otp');

const register = asyncHandler(async (req, res) => {
  const {email, firstName, lastName, dob, password} = req.body;
  await sendOtp(registerOtpStore, email, {userData: {email, firstName, lastName, dob, password}});
  res.status(200).json({message: 'OTP sent to your email. It expires in 2 minutes.'});
});

const verifyOtp = asyncHandler(async (req, res) => {
  const {email, otp} = req.body;
  const record = consumeOtp(registerOtpStore, email, otp);

  const {firstName, lastName, dob, password} = record.userData;
  const user = new User({email, firstName, lastName, dob, password});
  await user.save();

  res.status(201).json({
    message: 'User registered successfully',
    user: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      roles: user.roles
    },
    accessToken: signToken(user)
  });
});

const login = asyncHandler(async (req, res, next) => {
  const {email, password} = req.body;
  const user = await User.findOne({email});
  if (!user) {
    const err = new Error('Invalid credentials');
    err.name = 'UnauthorizedError';
    return next(err);
  }

  const isMatch = await user.comparePassword(password);
  if (!isMatch) {
    const err = new Error('Invalid credentials');
    err.name = 'UnauthorizedError';
    return next(err);
  }

  await sendOtp(loginOtpStore, email);
  res.status(200).json({message: 'OTP sent to your email. It expires in 2 minutes.'});
});

const verifyLoginOtp = asyncHandler(async (req, res, next) => {
  const {email, otp} = req.body;
  consumeOtp(loginOtpStore, email, otp);

  const user = await User.findOne({email});
  if (!user) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }

  res.json({accessToken: signToken(user)});
});

const getMe = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.user.id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }
  res.json({
    id: user._id,
    email: user.email,
    firstName: user.firstName,
    lastName: user.lastName,
    dob: user.dob,
    roles: user.roles,
    createdAt: user.createdAt
  });
});

const updateMe = asyncHandler(async (req, res, next) => {
  const existing = await User.findById(req.user.id);
  if (!existing) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }

  const {firstName, lastName, dob, password} = req.body;
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (dob !== undefined) updates.dob = dob;
  if (password !== undefined) updates.password = password;

  const user = await User.findByIdAndUpdate(req.user.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.json({message: 'User updated successfully', data: user});
});

module.exports = {register, verifyOtp, login, verifyLoginOtp, getMe, updateMe};
