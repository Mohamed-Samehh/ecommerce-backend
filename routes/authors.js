const express = require('express');
const {authorController} = require('../controllers');
const isAdmin = require('../middleware/admin'); // then, check the req.user.roles
const auth = require('../middleware/auth'); // first set the req.user
const validateRequest = require('../middleware/validate-request');
const {authorSchema} = require('../utils/validations');

const router = express.Router();

router.get('/', authorController.findAllAuthors);

router.get('/:id', authorController.findAuthorById);

router.post('/', auth, isAdmin, validateRequest(authorSchema), authorController.createAuthor);

router.put('/:id', auth, isAdmin, authorController.replaceAuthor);

router.patch('/:id', auth, isAdmin, authorController.updateAuthor);

router.delete('/:id', auth, isAdmin, authorController.deleteAuthor);

module.exports = router;
