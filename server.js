const express = require("express");
const path = require("path"); // no need to install
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError");
const listings = require("./routes/listing.js");
const review = require("./routes/review.js");

const app = express();

//configuration
app.use(methodOverride("_method"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine)
app.use("/listings/:id/review", review);
app.use("/listings", listings);

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

//ERROR 404 page not found error handling middleware
app.all("*", (req, res, next)=>{
  next(new expressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  //first deconstruct the error object that we recieved from error handling middlewares
  const {name, status = 500, message = "Something went WRONG!"} = err;
  // console.log(name);

  res.status(status).render("error.ejs", {message});
})

// starting server
app.listen(8080, () => {
  console.log("Listening at 8080");
});
