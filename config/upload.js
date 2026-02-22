const multer = require('multer');

const maximumFileSize = 5 * 1024 * 1024.0;
module.exports = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: maximumFileSize// that is the maximum
  },
  fileFilter: (req, file, cb) => {
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp'];
    if (allowedTypes.includes(file.mimetype)) {
      cb(null, true);
    } else {
      const error = new Error('Invalid file type. Only JPEG, PNG, and WEBP allowed.');
      error.name = 'InvalidFileType';
      cb(error);
    }
  }
}); ;
