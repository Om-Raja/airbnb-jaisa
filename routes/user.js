const express = require("express");
const router = express.Router();
const User = require("../models/user");
const asyncWrapper = require("../utils/asyncWrapper");

router.get("/signup", (req, res)=>{
    res.render("user/signup.ejs");
});

router.post("/signup", asyncWrapper( async(req, res)=>{
    try{
        const {username, password, email} = req.body;
        const newUser = new User({ username, email });
        const registeredUser = await User.register(newUser, password); 
        console.log(registeredUser);
        req.flash("success", "User registration successful!");
        res.redirect("/listings");
    }catch(err){
        req.flash("error", err.message);
        res.redirect("/signup");
    }
}));

module.exports = router;