const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const asyncWrapper = require("../utils/asyncWrapper");
const {isLoggedIn, isListOwner, validateListing} = require("../utils/middlewares");
const listingController = require("../controllers/listing");
const multer = require("multer");
const {storage} = require("../cloudConfig");
const upload = multer({storage});

// create route
// written before /listing/:id otherwise server would consider 'new' is an id
router.get("/new", isLoggedIn, listingController.getNewListingForm);

router.route("/")
.get(asyncWrapper(listingController.indexRoute))
.post(isLoggedIn, upload.single("listing[image]"), validateListing, asyncWrapper(listingController.addNewListing));

router.route("/:id")
.get(asyncWrapper(listingController.showListing))
.put(isLoggedIn, isListOwner, upload.single("listing[image]"), validateListing, asyncWrapper(listingController.updateListing))
.delete(isLoggedIn, isListOwner, asyncWrapper(listingController.destroyListing));

//edit route
router.get("/:id/edit", isLoggedIn, isListOwner, asyncWrapper(listingController.editListing));

module.exports = router;
