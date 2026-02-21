const express = require('express');
const {bookController} = require('../controllers');
const validateRequest = require('../middleware/validate-request');
const {bookSchema, patchBookSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', validateRequest(bookSchema), bookController.createBook);

router.put('/:id', validateRequest(bookSchema), bookController.replaceBook);

router.patch('/:id', validateRequest(patchBookSchema), bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;
