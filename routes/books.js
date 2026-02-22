const express = require('express');
const upload = require('../config/upload');
const {bookController} = require('../controllers');
const validateRequest = require('../middleware/validate-request');
const {bookSchema, patchBookSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', upload.single('image'), validateRequest(bookSchema), bookController.createBook);

router.put('/:id', upload.single('image'), validateRequest(bookSchema), bookController.replaceBook);

router.patch('/:id', upload.single('image'), validateRequest(patchBookSchema), bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;
