const asyncWrapper = require("./asyncWrapper");
const Listing = require("../models/listing");
const Review = require("../models/reviews");
const expressError = require("./expressError");
const {listingSchema, reviewSchema} = require("./joiSchema");

module.exports.isLoggedIn = (req, res, next) => {
  if (!req.isAuthenticated()) {
    req.session.redirectUrl = req.originalUrl;
    res.locals.redirectUrl = req.originalUrl;
    req.flash("error", "You must be logged in first to perform this action!");
    return res.redirect("/login");
  }
  next();
};

module.exports.saveRedirectUrl = (req, res, next) => {
  if (req.session.redirectUrl) {
    res.locals.redirectUrl = req.session.redirectUrl;
  }
  next();
};

module.exports.isListOwner = asyncWrapper(async (req, res, next) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!res.locals.currentUser._id.equals(list.owner._id)) {
    req.flash("error", "You don't have permission to edit/delete other's data");
    return res.status(403).redirect(`/listings/${id}`); //it still sends status = 200 OK
  }
  next();
});

module.exports.isReviewOwner = asyncWrapper( async(req, res, next) => {
  const {id, reviewId} = req.params;
  const review = await Review.findById(reviewId);

  if(!res.locals.currentUser._id.equals(review.owner._id)){
    req.flash("error", "Only the owner of review can delete the review!");
    return res.redirect(`/listings/${id}`);
  }
  next();
})

module.exports.validateListing = (req, res, next) => {
  const { value, error } = listingSchema.validate(req.body);
  if (error) throw new expressError(400, error);
  else next();
};

module.exports.validateReview = (req, res, next) =>{
  const {value, error} = reviewSchema.validate(req.body);
  if(error) throw new expressError(400, error);
  else next();
}