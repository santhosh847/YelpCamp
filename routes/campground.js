const express = require("express");
const router = express.Router();
const campgrounds = require("../controllers/campgrounds");
const {
	isLoggedIn,
	isAuthor,
	validateCampground,
} = require("../utils/middleware");

const multer = require("multer");
const { storage } = require("../cloudinary");
const upload = multer({ storage });

router
	.route("/")
	.get(campgrounds.showCampgrounds)
	.post(
		isLoggedIn,
		upload.array("image"),
		validateCampground,
		campgrounds.createCampground
	);

router.get("/new", isLoggedIn, campgrounds.renderNewCampgroundForm);

router
	.route("/:id")
	.get(campgrounds.showCampground)
	.put(
		isLoggedIn,
		isAuthor,
		upload.array("image"),
		validateCampground,
		campgrounds.updateCampground
	)
	.delete(isLoggedIn, isAuthor, campgrounds.deleteCampground);

router.get("/:id/edit", isLoggedIn, isAuthor, campgrounds.renderEditCampground);

module.exports = router;
