const express = require('express');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {cartSchema} = require('../utils/validations');

const router = express.Router();
const {cartController} = require('../controllers');

router.get('/', auth, cartController.display); // view cart (logged in user)
router.post('/', auth, validateRequest(cartSchema), cartController.add); // add book to cart (same )
router.delete('/:bookId', auth, cartController.remove); // delete book from cart (same)

module.exports = router;
