const express = require("express");
const router = express.Router();
const Listing = require("../models/listing");
const asyncWrapper = require("../utils/asyncWrapper");
const expressError = require("../utils/expressError");
const {listingSchema} = require("../utils/joiSchema");

const validateListing = (req, res, next) => {
  const { value, error } = listingSchema.validate(req.body);
  if (error) throw new expressError(400, error);
  else next();
};

//index route
router.get("/", async (req, res) => {
  const allListing = await Listing.find({});
  // res.send("working");
  res.cookie("route", "index");
  res.cookie("method", "GET");
  res.render("listings/index.ejs", { allListing });
});

router.post(
  "/",
  validateListing,
  asyncWrapper(async (req, res, next) => {
    // if(!req.body.listing) throw new expressError(400, "You did not send us your information. Try again!");

    // const {value, error} = listingSchema.validate(req.body);
    // if(error) throw new expressError(400, error);

    const newListing = new Listing(req.body.listing);
    await newListing.save();

    res.redirect("/listings");
  }),
);

//create route
// written before /listing/:id otherwise server would consider 'new' is an id
router.get("/new", (req, res) => {
  res.cookie("route", "/listing/new");
  res.cookie("asking", "new form to create a list");
  res.render("listings/new.ejs");
});

//show route
router.get(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    let list = await Listing.findById(id).populate("reviews");
    res.render("listings/show.ejs", { list });
  }),
);

//edit route
router.get(
  "/:id/edit",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs", { list });
  }),
);

router.put("/:id", validateListing, asyncWrapper(async (req, res) => {
    // if(!req.body.listing) throw new expressError(400, "You haven't filled the data completely");

    const { id } = req.params;
    const newListing = req.body.listing;
    await Listing.findByIdAndUpdate(id, { ...newListing }); //destrucured

    //redirecting to show route
    res.redirect(`/listings/${id}`);
  }),
);

//delete route
router.delete(
  "/:id",
  asyncWrapper(async (req, res) => {
    const { id } = req.params;
    await Listing.findByIdAndDelete(id);
    res.redirect("/listings");
  }),
);

module.exports = router;
