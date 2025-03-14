const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrapper = require("../utils/asyncWrapper");
const passport = require("passport");
const {isLoggedIn, saveRedirectUrl} = require("../utils/middlewares");

//signup
router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup", asyncWrapper( async(req, res)=>{
    try{
        const {username, password, email} = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password);
        req.login(registeredUser, (err)=>{
            if(err) return next(err);
            req.flash("success", `Welcome ${username} to WanderLust!`);
            res.redirect("/listings");
        })
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

//login
router.get("/login", (req, res)=>{
    res.render("user/login.ejs");
});

router.post("/login", saveRedirectUrl, passport.authenticate("local", {failureRedirect: "/login", failureFlash: true}), asyncWrapper(async(req, res)=>{
    req.flash("success", `Welcome back ${req.body.username}`);
    res.redirect(res.locals.redirectUrl || "/listings");
}));

//logout
router.get("/logout", isLoggedIn, (req, res, next)=>{
    req.logout((err)=>{
        if(err){
            return next(err);
        }
        req.flash("success", "Logged out");
        res.redirect("/listings");
    })
})

router.get("/profile", isLoggedIn, (req, res)=>{
    res.render("user/profile.ejs");
});

module.exports = router;