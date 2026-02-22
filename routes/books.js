const express = require('express');
const upload = require('../config/upload');
const {bookController} = require('../controllers');
const cloudinaryHandler = require('../middleware/cloudinary');
const validateRequest = require('../middleware/validate-request');
const {bookSchema, patchBookSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', upload.single('image'), validateRequest(bookSchema), cloudinaryHandler, bookController.createBook);

router.put('/:id', validateRequest(bookSchema), bookController.replaceBook);

router.patch('/:id', validateRequest(patchBookSchema), bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;
