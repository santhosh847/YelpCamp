const Review = require("../models/review");
const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");

module.exports.createReview = catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id);
	const review = new Review(req.body.review);
	review.author = req.user._id;
	campground.reviews.push(review);
	await review.save();
	await campground.save();
	req.flash("success", "successfully created new review");
	res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.deleteReview = catchAsync(async (req, res, next) => {
	const { id, reviewId } = req.params;
	await Campground.findOneAndUpdate(id, { $pull: { reviews: reviewId } });
	await Review.findByIdAndDelete(reviewId);
	req.flash("success", "successfully deleted review");
	res.redirect(`/campgrounds/${id}`);
});
