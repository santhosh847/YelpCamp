const Campground = require("../models/campground");
const catchAsync = require("../utils/catchAsync");
const { cloudinary } = require("../cloudinary");
const mbxGeoCoding = require("@mapbox/mapbox-sdk/services/geocoding");
const mapBoxToken = process.env.MAPBOX_TOKEN;
const geocoder = mbxGeoCoding({ accessToken: mapBoxToken });

module.exports.showCampgrounds = catchAsync(async (req, res) => {
	const campgrounds = await Campground.find({});
	res.render("campgrounds/index", { campgrounds });
});

module.exports.renderNewCampgroundForm = (req, res) => {
	res.render("campgrounds/new");
};

module.exports.createCampground = catchAsync(async (req, res, next) => {
	const geoData = await geocoder
		.forwardGeocode({
			query: req.body.campground.location,
			limit: 1,
		})
		.send();

	const campground = new Campground(req.body.campground);
	campground.geometry = geoData.body.features[0].geometry;
	campground.images = req.files.map((f) => ({
		url: f.path,
		filename: f.filename,
	}));
	campground.author = req.user._id;
	await campground.save();
	console.log(campground);
	req.flash("success", "Success, new campground is added");
	res.redirect(`/campgrounds/${campground._id}`);
});

module.exports.showCampground = catchAsync(async (req, res) => {
	const campground = await Campground.findById(req.params.id)
		.populate({ path: "reviews", populate: { path: "author" } })
		.populate("author");

	if (!campground) {
		req.flash("error", "campground does not exist!");
		return res.redirect("/campgrounds");
	}
	res.render("campgrounds/show", { campground });
});

module.exports.updateCampground = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findByIdAndUpdate(
		id,
		req.body.campground
	);
	campground.images.push(
		...req.files.map((f) => ({
			url: f.path,
			filename: f.filename,
		}))
	);

	await campground.save();
	if (req.body.deleteimages) {
		for (let filename of req.body.deleteimages) {
			await cloudinary.uploader.destroy(filename);
		}

		await campground.updateOne({
			$pull: { images: { filename: { $in: req.body.deleteimages } } },
		});
	}
	req.flash("success", "succesfully updated the campground");
	res.redirect(`/campgrounds/${id}`);
});

module.exports.deleteCampground = catchAsync(async (req, res) => {
	const { id } = req.params;
	await Campground.findByIdAndDelete(id);
	req.flash("success", "succesfully deleted campground");
	res.redirect("/campgrounds");
});

module.exports.renderEditCampground = catchAsync(async (req, res) => {
	const { id } = req.params;
	const campground = await Campground.findById(id);
	if (!campground) {
		req.flash("error", "campground does not exist!");
		return res.redirect("/campgrounds");
	}
	res.render(`campgrounds/edit`, { campground });
});
