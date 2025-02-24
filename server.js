const express = require("express");
const path = require("path"); // no need to install
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const asyncWrapper = require("./utils/asyncWrapper")
const expressError = require("./utils/expressError")

const app = express();

//configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(methodOverride("_method"));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine)

//database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
async function main() {
  await mongoose.connect(MONGO_URL);
}
main()
  .then(() => {
    console.log("Database connnected successfully");
  })
  .catch((err) => {
    console.log(err);
  });

//APIs
app.get("/", (req, res) => {
  res.send("I'm groot");
});

//index route
app.get("/listings", async (req, res) => {
  const allListing = await Listing.find({});
  // res.send("working");
  res.render("listings/index.ejs", { allListing });
});
app.post("/listings", asyncWrapper(async (req, res, next) => {
  if(!req.body.listing) throw new expressError(400, "You did not send us your information. Try again!");

    const newListing = new Listing(req.body.listing);
    await newListing.save();
  
    res.redirect("/listings");
}));

//create route
// written before /listing/:id otherwise server would consider 'new' is an id
app.get("/listings/new", (req, res) => {
  res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", asyncWrapper(async (req, res) => {
  const { id } = req.params;
  let list = await Listing.findById(id);
  res.render("listings/show.ejs", { list });
}));

//edit route
app.get("/listings/:id/edit", asyncWrapper(async (req, res) => {
  const { id } = req.params;
  const list = await Listing.findById(id);
  res.render("listings/edit.ejs", { list });
}));

app.put("/listings/:id", asyncWrapper(async (req, res) => {

  if(!req.body.listing) throw new expressError(400, "You haven't filled the data completely");

  const { id } = req.params;
  const newListing = req.body.listing;
  const list = await Listing.findByIdAndUpdate(id, { ...newListing }); //destrucured

  //redirecting to show route
  res.redirect(`/listings/${id}`);
}));

//delete route
app.delete("/listings/:id", asyncWrapper(async (req, res) => {
  const { id } = req.params;
  await Listing.findByIdAndDelete(id);
  res.redirect("/listings");
}));

//ERROR 404 page not found error handling middleware
app.all("*", (req, res, next)=>{
  next(new expressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  //first deconstruct the error object that we recieved from error handling middlewares
  const {name, status = 500, message = "Something went WRONG!"} = err;
  console.log(name);

  res.status(status).send(message);
})

// starting server
app.listen(8080, () => {
  console.log("Listening at 8080");
});
