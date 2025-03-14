const express = require("express");
const router = express.Router();
const asyncWrapper = require("../utils/asyncWrapper");
const passport = require("passport");
const {isLoggedIn, saveRedirectUrl} = require("../utils/middlewares");
const userController = require("../controllers/user");

//signup
router.get("/signup", userController.getSignUpForm);

router.post("/signup", asyncWrapper(userController.signUp));

//login
router.get("/login", userController.getLoginForm);

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), asyncWrapper(userController.postLoginTask));

//logout
router.get("/logout", isLoggedIn, userController.logOut);

router.get("/profile", isLoggedIn, userController.getProfile);

module.exports = router;