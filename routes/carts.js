const express = require('express');
const auth = require('../middleware/auth');

const router = express.Router();
const {cartController} = require('../controllers'); // TODO: Link from sameh

router.get('/', auth, cartController.display); // view cart (logged in user)
router.post('/', auth, cartController.add); // add book to cart (same )
router.delete('/:bookId', auth, cartController.remove); // delete book from cart (same)

module.exports = router;
