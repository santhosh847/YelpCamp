const User = require("../models/user");

module.exports.renderRegisterPage = (req, res) => {
	res.render("user/register");
};

module.exports.registerUser = async (req, res) => {
	try {
		const { username, email, password } = req.body;
		const user = new User({ username, email });
		const newUser = await User.register(user, password);
		req.login(newUser, function (err) {
			if (err) {
				next(err);
			}
			req.flash("success", "registered succesfully");
			res.redirect("/campgrounds");
		});
	} catch (e) {
		req.flash("error", e.message);
		res.redirect("/register");
	}
};

module.exports.renderLoginPage = (req, res) => {
	res.render("user/login");
};

module.exports.redirectUser = (req, res) => {
	req.flash("success", "logged in!");
	delete req.session.returnTo;
	res.redirect(res.locals.returnTo);
};

module.exports.logoutUser = (req, res, next) => {
	req.logout(function (err) {
		if (err) {
			return next(err);
		}
		req.flash("success", "logged out");
		res.redirect("/campgrounds");
	});
};
