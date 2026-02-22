const cloudinary = require('../config/cloudinary');
const asyncHandler = require('./async-handler');

const cloudinaryHandler = asyncHandler(async (req, res, next) => {
  if (!req.file) return next();
  const fileStr = `data:${req.file.mimetype};base64,${req.file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(fileStr, {
    folder: 'ecommerce/books'
  });
  req.body.coverImage = result.secure_url;
  next();
});
module.exports = cloudinaryHandler;
