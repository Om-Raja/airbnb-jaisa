const express = require("express");
const router = express.Router({mergeParams: true});
const asyncWrapper = require("../utils/asyncWrapper");
const {isLoggedIn, validateReview, isReviewOwner} = require("../utils/middlewares");
const reviewController = require("../controllers/review");


//review route
router.post("/", isLoggedIn, validateReview, asyncWrapper(reviewController.addReview));

// review delete route
router.delete("/:reviewId", isLoggedIn, isReviewOwner, asyncWrapper(reviewController.destroyReview));

module.exports = router;