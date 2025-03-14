const Listing = require("../models/listing");

//index route
module.exports.indexRoute = async (req, res) => {
  const allListing = await Listing.find({});
  // res.send("working");
  res.render("listings/index.ejs", { allListing });
};

//create routes
module.exports.getNewListingForm = (req, res) => {
  res.render("listings/new.ejs");
};

module.exports.addNewListing = async (req, res) => {
  // if(!req.body.listing) throw new expressError(400, "You did not send us your information. Try again!");

  // const {value, error} = listingSchema.validate(req.body);
  // if(error) throw new expressError(400, error);
  const newListing = new Listing(req.body.listing);
  newListing.owner = req.user._id;
  await newListing.save();
  req.flash("success", "New listing saved.");
  res.redirect("/listings");
};

//show route
module.exports.showListing = async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id)
    .populate("owner")
    .populate({
      path: "reviews",
      populate: {
        path: "owner",
      },
    });
  if (!list) {
    req.flash("error", "Place you are requesting doesn't exist on this page!");
    res.redirect("/listings");
  }
  res.render("listings/show.ejs", { list });
};

//edit route
module.exports.editListing = async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  if (!list) {
    req.flash("error", "This place doesn't exit on this page!");
    res.redirect("/listings");
  }
  res.render("listings/edit.ejs", { list });
};

//update route
module.exports.updateListing = async (req, res) => {
  // if(!req.body.listing) throw new expressError(400, "You haven't filled the data completely");

  const { id } = req.params;
  const newListing = req.body.listing;
  await Listing.findByIdAndUpdate(id, { ...newListing }); //destrucured
  req.flash("success", "List updated");
  //redirecting to show route
  res.redirect(`/listings/${id}`);
};

//delete route
module.exports.destroyListing = async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  req.flash("success", "Listing deleted.");
  res.redirect("/listings");
};
