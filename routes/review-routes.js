const express = require('express');

const router = express.Router();
const reviewController = require('../controllers/review-controller');
const validateRequest = require('../middleware/validate-request');
const {reviewSchema} = require('../utils/validations');

router.post('/', validateRequest(reviewSchema), reviewController.addReview);

router.get('/book/:bookId', reviewController.getBookReviews);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;
