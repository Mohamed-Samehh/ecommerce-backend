const express = require('express');
const {bookController} = require('../controllers');

const router = express.Router();

router.get('/', bookController.findAllBooks);

router.get('/:id', bookController.findBookById);

router.post('/', bookController.createBook);

router.put('/:id', bookController.updateBook);

router.delete('/:id', bookController.deleteBook);

module.exports = router;
