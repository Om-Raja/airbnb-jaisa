const User = require("../models/user");
// signup
module.exports.getSignUpForm = (req, res) => {
  res.render("user/signup.ejs");
};

module.exports.signUp = async (req, res) => {
  try {
    const { username, password, email } = req.body;
    const newUser = new User({ username, email });
    const registeredUser = await User.register(newUser, password);
    req.login(registeredUser, (err) => {
      if (err) return next(err);
      req.flash("success", `Welcome ${username} to WanderLust!`);
      res.redirect("/listings");
    });
  } catch (err) {
    req.flash("error", err.message);
    res.redirect("/signup");
  }
};

// login
module.exports.getLoginForm = (req, res) => {
  res.render("user/login.ejs");
};

module.exports.postLoginTask = async (req, res) => {
  req.flash("success", `Welcome back ${req.body.username}`);
  res.redirect(res.locals.redirectUrl || "/listings");
};

// logout
module.exports.logOut = (req, res, next) => {
  req.logout((err) => {
    if (err) {
      return next(err);
    }
    req.flash("success", "Logged out");
    res.redirect("/listings");
  });
};

// profile
module.exports.getProfile = (req, res) => {
  res.render("user/profile.ejs");
};
