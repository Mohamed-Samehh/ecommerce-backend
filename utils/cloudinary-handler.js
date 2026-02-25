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

  return result;
};
const deleteFromCloudinary = async (publicId) => {
  const result = await cloudinary.uploader.destroy(publicId);
  if (result.result !== 'ok') {
    const error = new Error(`Failed to delete image: ${result.result}`);
    error.name = 'CloudinaryFailedToDelete';
    throw error;
  }
  return result;
};
module.exports = {cloudinaryUploader, deleteFromCloudinary};
