const express = require("express");
const router = express.Router();
const passport = require("passport");
const { storeReturnTo } = require("../utils/middleware");
const userController = require("../controllers/users");

router
	.route("/register")
	.get(userController.renderRegisterPage)
	.post(userController.registerUser);

router
	.route("/login")
	.get(userController.renderLoginPage)
	.post(
		storeReturnTo,
		passport.authenticate("local", {
			failureFlash: true,
			failureRedirect: "/login",
		}),
		userController.redirectUser
	);

router.get("/logout", userController.logoutUser);

module.exports = router;
