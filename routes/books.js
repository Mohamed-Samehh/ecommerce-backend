const express = require('express');
const upload = require('../config/upload');
const {bookController} = require('../controllers');
const isAdmin = require('../middleware/admin'); // then, check the req.user.roles
const auth = require('../middleware/auth'); // first set the req.user
const validateRequest = require('../middleware/validate-request');
const {bookSchema, patchBookSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', auth, isAdmin, upload.single('image'), validateRequest(bookSchema), bookController.createBook);

router.put('/:id', auth, isAdmin, upload.single('image'), validateRequest(bookSchema), bookController.replaceBook);

router.patch('/:id', auth, isAdmin, upload.single('image'), validateRequest(patchBookSchema), bookController.updateBook);

router.delete('/:id', auth, isAdmin, bookController.deleteBook);

module.exports = router;
