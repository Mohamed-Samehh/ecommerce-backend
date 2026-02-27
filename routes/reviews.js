const express = require('express');

const router = express.Router();
const {reviewController} = require('../controllers');
const admin = require('../middleware/admin');
const auth = require('../middleware/auth');
const validateRequest = require('../middleware/validate-request');
const {reviewSchema} = require('../utils/validations');

router.get('/book/:bookId', reviewController.getBookReviews);
router.get('/', auth, admin, reviewController.getAllReviews);

router.post('/', auth, validateRequest(reviewSchema), reviewController.addReview);
router.get('/my', auth, reviewController.getMyReviews);

router.delete('/:id', auth, reviewController.deleteReview);

module.exports = router;
