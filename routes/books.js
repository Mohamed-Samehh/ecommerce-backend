const express = require('express');
const upload = require('../config/upload');
const {bookController} = require('../controllers');
const isAdmin = require('../middleware/admin'); // then, check the req.user.roles
const auth = require('../middleware/auth'); // first set the req.user
const {validateAuthorExsists, validateCategoryExsists} = require('../middleware/book-ref-validations');
const validateQuery = require('../middleware/validate-query');

const validateRequest = require('../middleware/validate-request');
const {bookSchema, patchBookSchema, bookQuerySchema} = require('../utils/validations');

const router = express.Router();

router.get('/', validateQuery(bookQuerySchema), bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', auth, isAdmin, upload.single('image'), validateRequest(bookSchema), validateAuthorExsists, validateCategoryExsists, bookController.createBook);

router.put('/:id', auth, isAdmin, upload.single('image'), validateRequest(bookSchema), validateAuthorExsists, validateCategoryExsists, bookController.replaceBook);

router.patch('/:id', auth, isAdmin, upload.single('image'), validateRequest(patchBookSchema), validateAuthorExsists, validateCategoryExsists, bookController.updateBook);

router.delete('/:id', auth, isAdmin, bookController.deleteBook);

module.exports = router;
