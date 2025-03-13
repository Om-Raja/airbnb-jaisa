module.exports.isLoggedIn = (req, res, next) => {
    if(! req.isAuthenticated()){
        req.session.redirectUrl = req.originalUrl;
        res.locals.redirectUrl = req.originalUrl;
        req.flash("error", "You must be logged in first to perform this action!");
        return res.redirect("/login");
    }
    next();
}

module.exports.saveRedirectUrl = (req, res, next) => {
    if(req.session.redirectUrl){
        res.locals.redirectUrl = req.session.redirectUrl;
    }
    next();
}