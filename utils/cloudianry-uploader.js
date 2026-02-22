const cloudinary = require('../config/cloudinary');

const cloudinaryUploader = async (file) => {
  if (!file) {
    const error = new Error('no image uploaded');
    error.name = 'NoImageUploaded';
    throw error;
  }
  const fileStr = `data:${file.mimetype};base64,${file.buffer.toString('base64')}`;
  const result = await cloudinary.uploader.upload(fileStr, {
    folder: 'ecommerce/books'
  });
  return result.secure_url;
};
module.exports = cloudinaryUploader;
