const express = require('express');
const {authorController} = require('../controllers');

const router = express.Router();

router.get('/', authorController.findAllAuthors);

router.get('/:id', authorController.findAuthorById);

router.post('/', authorController.createAuthor);

router.put('/:id', authorController.updateAuthor);

module.exports = router;
