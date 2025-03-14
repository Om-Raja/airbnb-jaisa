const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const passport = require("passport");
const {isLoggedIn, saveRedirectUrl} = require("../utils/middlewares");
const userController = require("../controllers/user");

// signup
router.route("/signup")
.get(userController.getSignUpForm)
.post(asyncWrapper(userController.signUp));

// login
router.route("/login")
.get(userController.getLoginForm)
.post(saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), asyncWrapper(userController.postLoginTask))


// logout
router.get("/logout", isLoggedIn, userController.logOut);

// profile
router.get("/profile", isLoggedIn, userController.getProfile);

module.exports = router;