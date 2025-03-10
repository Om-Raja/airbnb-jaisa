const express = require("express");
const router = express.Router({mergeParams: true});
const Listing = require("../models/listing");
const asyncWrapper = require("../utils/asyncWrapper");
const expressError = require("../utils/expressError");
const {reviewSchema} = require("../utils/joiSchema");
const Review = require("../models/reviews");

//validate middleware
const validateReview = (req, res, next) =>{
  const {value, error} = reviewSchema.validate(req.body);
  if(error) throw new expressError(400, error);
  else next();
}

//review route
router.post(
  "/",
  validateReview,
  asyncWrapper(async (req, res, next) => {
    const { id } = req.params;
    const newReview = new Review(req.body.review);
    let list = await Listing.findById(id);
    list.reviews.push(newReview);

    await newReview.save();
    await list.save();
    req.flash("success", "Review added");

    res.redirect(`/listings/${id}`);
  }),
);

// review delete route
router.delete(
  "/:reviewId",
  asyncWrapper(async function (req, res, next) {
    const { id, reviewId } = req.params;
    await Review.findByIdAndDelete(reviewId);
    await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
    req.flash("success", "Review removed.");

    res.redirect(`/listings/${id}`);
  }),
);

module.exports = router;