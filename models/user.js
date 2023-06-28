const { string } = require("joi");
const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const passportLocalMongoose = require("passport-local-mongoose");

const UserSchema = Schema({
	email: {
		type: String,
		required: true,
		unique: true,
	},
});

UserSchema.plugin(passportLocalMongoose);

UserSchema.post("save", function (error, doc, next) {
	if (
		error.name === "MongoServerError" &&
		error.code === 11000 &&
		error.keyValue.email
	) {
		next(
			new Error(
				"Email address was already taken, please choose a different one."
			)
		);
	} else {
		next(error);
	}
});

module.exports = mongoose.model("User", UserSchema);
