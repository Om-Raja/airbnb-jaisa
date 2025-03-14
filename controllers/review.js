const Listing = require("../models/listing");
const Review = require("../models/reviews");

// post route
module.exports.addReview = async (req, res, next) => {
  const { id } = req.params;
  const newReview = new Review(req.body.review);
  let list = await Listing.findById(id);
  list.reviews.push(newReview);
  newReview.owner = req.user._id;
  await newReview.save();
  await list.save();
  req.flash("success", "Review added");

  res.redirect(`/listings/${id}`);
};

// delete route
module.exports.destroyReview = async function (req, res, next) {
  const { id, reviewId } = req.params;
  await Review.findByIdAndDelete(reviewId);
  await Listing.findByIdAndUpdate(id, { $pull: { reviews: reviewId } });
  req.flash("success", "Review removed.");

  res.redirect(`/listings/${id}`);
};
