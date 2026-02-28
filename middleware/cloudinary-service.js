const {cloudinaryUploader} = require('../utils/cloudinary-handler');
const asyncHandler = require('./async-handler');

const cloudianryService = asyncHandler(async (req, res, next) => {
  if (req.file) {
    const result = await cloudinaryUploader(req.file);
    req.public_id = result.public_id;
    req.secure_url = result.secure_url;
  }
  next();
});

module.exports = cloudianryService;
