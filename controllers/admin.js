const asyncHandler = require('../middleware/async-handler');
const User = require('../models/user');

const getUsers = asyncHandler(async (req, res) => {
  const page = Math.max(1, Number.parseInt(req.query.page) || 1);
  const limit = Math.min(100, Math.max(1, Number.parseInt(req.query.limit) || 20));
  const skip = (page - 1) * limit;

  const filter = {};
  if (req.query.role) {
    if (req.query.role === 'user') {
      filter.roles = {$size: 1, $all: ['user']};
    } else {
      filter.roles = req.query.role;
    }
  }
  if (req.query.search) {
    const search = {$regex: req.query.search, $options: 'i'};
    filter.$or = [{firstName: search}, {lastName: search}, {email: search}];
  }

  const [users, total] = await Promise.all([
    User.find(filter).select('-password').skip(skip).limit(limit).sort({createdAt: -1}),
    User.countDocuments(filter)
  ]);

  res.json({
    data: users,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  });
});

const getUserById = asyncHandler(async (req, res, next) => {
  const user = await User.findById(req.params.id).select('-password');
  if (!user) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }
  res.json({data: user});
});

const createUser = asyncHandler(async (req, res) => {
  const {firstName, lastName, dob, email, password, isAdmin} = req.body;

  const existingUser = await User.exists({email});
  if (existingUser) {
    return res.status(409).json({message: 'This email is already taken.'});
  }

  const roles = isAdmin ? ['user', 'admin'] : ['user'];
  const user = new User({firstName, lastName, dob, email, password, roles});
  await user.save();

  res.status(201).json({
    message: 'User created successfully',
    data: {
      id: user._id,
      email: user.email,
      firstName: user.firstName,
      lastName: user.lastName,
      dob: user.dob,
      roles: user.roles,
      createdAt: user.createdAt
    }
  });
});

const updateUser = asyncHandler(async (req, res, next) => {
  const existing = await User.findById(req.params.id);
  if (!existing) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }

  const {firstName, lastName, dob, email, password, isAdmin} = req.body;
  const updates = {};
  if (firstName !== undefined) updates.firstName = firstName;
  if (lastName !== undefined) updates.lastName = lastName;
  if (dob !== undefined) updates.dob = dob;
  if (email !== undefined) updates.email = email;
  if (password !== undefined) updates.password = password;
  if (isAdmin !== undefined) updates.roles = isAdmin ? ['user', 'admin'] : ['user'];

  const user = await User.findByIdAndUpdate(req.params.id, updates, {
    new: true,
    runValidators: true
  }).select('-password');

  res.json({message: 'User updated successfully', data: user});
});

const deleteUser = asyncHandler(async (req, res, next) => {
  const user = await User.findByIdAndDelete(req.params.id);
  if (!user) {
    const err = new Error('User not found');
    err.name = 'UserNotFoundError';
    return next(err);
  }
  res.json({message: 'User deleted successfully'});
});

module.exports = {getUsers, getUserById, createUser, updateUser, deleteUser};
