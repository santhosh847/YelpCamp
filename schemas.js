let joi = require("joi");
const sanitizeHTML = require("sanitize-html");

const extension = (joi) => ({
	type: "string",
	base: joi.string(),
	messages: {
		"string.escapeHTML": "Hey cheesy guy, scripts are not allowed",
	},
	rules: {
		escapeHTML: {
			validate(value, helpers) {
				const clean = sanitizeHTML(value, {
					allowedTags: [],
					allowedAttributes: {},
				});
				if (clean != value)
					return helpers.error("string.escapeHTML", { value });
				return clean;
			},
		},
	},
});

joi = joi.extend(extension);

module.exports.reviewSchema = joi.object({
	review: joi
		.object({
			body: joi.string().required().escapeHTML(),
			rating: joi.number().min(1).max(5).required(),
		})
		.required(),
});

module.exports.campgroundSchema = joi.object({
	campground: joi
		.object({
			title: joi.string().required().escapeHTML(),
			price: joi.number().required().min(0),
			// image: joi.string().required(),
			description: joi.string().required().escapeHTML(),
			location: joi.string().required().escapeHTML(),
		})
		.required(),
	deleteimages: joi.array(),
});
