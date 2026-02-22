const express = require('express');

const router = express.Router();
const {reviewController} = require('../controllers');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {reviewSchema} = require('../utils/validations');

router.get('/book/:bookId', reviewController.getBookReviews);

router.post('/', auth, validateRequest(reviewSchema), reviewController.addReview);

router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
