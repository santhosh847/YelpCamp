const express = require("express");
const router = express.Router({ mergeParams: true });
const reviewsController = require("../controllers/reviews");
const {
	isLoggedIn,
	validateReview,
	isReviewAuthor,
} = require("../utils/middleware");

router.post("/", isLoggedIn, validateReview, reviewsController.createReview);

router.delete(
	"/:reviewId",
	isLoggedIn,
	isReviewAuthor,
	reviewsController.deleteReview
);

module.exports = router;
