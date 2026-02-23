const process = require('node:process');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res, next) => {
  const {email, firstName, lastName, dob, password} = req.body;
  try {
    const user = new User({email, firstName, lastName, dob, password});
    await user.save();

    const token = jwt.sign(
      {id: user._id, email: user.email, roles: user.roles},
      process.env.JWT_SECRET,
      {expiresIn: '15d'}
    );

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
      accessToken: token
    });
  } catch (err) {
    next (err);
  }
};

exports.login = async (req, res, next) => {
  const {email, password} = req.body;
  try {
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

    const token = jwt.sign(
      {id: user._id, email: user.email, roles: user.roles},
      process.env.JWT_SECRET,
      {expiresIn: '15d'}
    );

    res.json({accessToken: token});
  } catch (err) {
    next(err);
  }
};

exports.getMe = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};

exports.updateMe = async (req, res, next) => {
  try {
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
  } catch (err) {
    next(err);
  }
};
