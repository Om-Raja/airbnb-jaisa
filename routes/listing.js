const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const asyncWrapper = require("../utils/asyncWrapper");
const {isLoggedIn, isListOwner, validateListing} = require("../utils/middlewares");
const listingController = require("../controllers/listing");

// index route
router.get("/", asyncWrapper(listingController.indexRoute));

// create route
// written before /listing/:id otherwise server would consider 'new' is an id
router.get("/new", isLoggedIn, listingController.getNewListingForm);

router.post("/", isLoggedIn, validateListing, asyncWrapper(listingController.addNewListing));

//show route
router.get("/:id", asyncWrapper(listingController.showListing));

//edit route
router.get("/:id/edit", isLoggedIn, isListOwner, asyncWrapper(listingController.editListing));

//patch route
router.put("/:id", isLoggedIn, isListOwner, validateListing, asyncWrapper(listingController.updateListing));

//delete route
router.delete("/:id", isLoggedIn, isListOwner, asyncWrapper(listingController.destroyListing));

module.exports = router;
