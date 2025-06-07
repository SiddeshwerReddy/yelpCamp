const express = require('express');
const router = express.Router({ mergeParams: true });
const { isLoggedIn, isReviewAuthor } = require('../middleware');
const reviews = require('../controllers/reviews');

// Create a review
router.post('/', isLoggedIn, reviews.createReview);

// Delete a review
router.delete('/:reviewId', isLoggedIn, isReviewAuthor, reviews.deleteReview);

module.exports = router;
