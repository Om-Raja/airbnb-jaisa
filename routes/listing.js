const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const asyncWrapper = require("../utils/asyncWrapper");
const {isLoggedIn, isListOwner, validateListing} = require("../utils/middlewares");
const listingController = require("../controllers/listing");

// create route
// written before /listing/:id otherwise server would consider 'new' is an id
router.get("/new", isLoggedIn, listingController.getNewListingForm);

router.route("/")
.get(asyncWrapper(listingController.indexRoute))
.post(isLoggedIn, validateListing, asyncWrapper(listingController.addNewListing));

router.route("/:id")
.get(asyncWrapper(listingController.showListing))
.put(isLoggedIn, isListOwner, validateListing, asyncWrapper(listingController.updateListing))
.delete(isLoggedIn, isListOwner, asyncWrapper(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isListOwner, asyncWrapper(listingController.editListing));

module.exports = router;
