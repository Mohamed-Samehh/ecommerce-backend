const express = require('express');

const router = express.Router();
const {reviewController} = require('../controllers');
const {protect} = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {reviewSchema} = require('../utils/validations');

router.get('/book/:bookId', reviewController.getBookReviews);

router.use(protect);

router.post('/', validateRequest(reviewSchema), reviewController.addReview);

router.delete('/:id', reviewController.deleteReview);

module.exports = router;
