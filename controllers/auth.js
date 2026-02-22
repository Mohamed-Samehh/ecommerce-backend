const process = require('node:process');
const jwt = require('jsonwebtoken');
const User = require('../models/user');

exports.register = async (req, res) => {
  const {email, firstName, lastName, dob, password} = req.body;
  try {
    const existingUser = await User.findOne({email});
    if (existingUser) {
      return res.status(400).json({message: 'Email already in use'});
    }

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
  // //   res.status(500).json({message: 'Server error'});
  // // }
  // }
  // catch (err) {
    console.error('DEBUG ERROR:', err);
    res.status(500).json({
      message: 'Server error',
      error: err.message,
      stack: err.stack
    });
  }
};

exports.login = async (req, res) => {
  const {email, password} = req.body;
  try {
    const user = await User.findOne({email});
    if (!user) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const isMatch = await user.comparePassword(password);
    if (!isMatch) {
      return res.status(401).json({message: 'Invalid credentials'});
    }

    const token = jwt.sign(
      {id: user._id, email: user.email, roles: user.roles},
      process.env.JWT_SECRET,
      {expiresIn: '15d'}
    );

    res.json({accessToken: token});
  } catch (err) {
    res.status(500).json({message: 'Server error'});
  }
};

exports.getMe = async (req, res) => {
  try {
    const user = await User.findById(req.user.id).select('-password');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
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
    res.status(500).json({message: 'Server error'});
  }
};

exports.updateMe = async (req, res) => {
  try {
    const updates = {};
    const allowedFields = ['firstName', 'lastName', 'dob', 'password'];
    allowedFields.forEach((field) => {
      if (req.body[field] !== undefined) updates[field] = req.body[field];
    });
    if (Object.keys(updates).length === 0) {
      return res.status(400).json({message: 'No valid fields to update'});
    }
    const user = await User.findByIdAndUpdate(
      req.user.id,
      updates,
      {returnDocument: 'after', runValidators: true}
    ).select('-password');
    if (!user) {
      return res.status(404).json({message: 'User not found'});
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
    res.status(500).json({message: 'Server error'});
  }
};
