const express = require('express');
const {authorController} = require('../controllers');
const validateRequest = require('../middleware/validate-request');
const {authorSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', authorController.findAllAuthors);

router.get('/:id', authorController.findAuthorById);

router.post('/', validateRequest(authorSchema), authorController.createAuthor);

router.put('/:id', authorController.replaceAuthor);

router.patch('/:id', authorController.updateAuthor);

router.delete('/:id', authorController.deleteAuthor);

module.exports = router;
