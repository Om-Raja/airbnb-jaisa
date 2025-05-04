if(process.env.NODE_ENV != "production"){
  require("dotenv").config();
}
const express = require("express");
const path = require("path"); // no need to install
const methodOverride = require("method-override");
const engine = require("ejs-mate");
const mongoose = require("mongoose");
const expressError = require("./utils/expressError");
const listingRouter = require("./routes/listing.js");
const reviewRouter = require("./routes/review.js");
const userRouter = require("./routes/user.js");
const cookieParser = require("cookie-parser");
const session = require("express-session");
const flash = require("connect-flash");
const MongoStore = require("connect-mongo");
const passport = require("passport");
const LocalStrategy = require("passport-local");
const User = require("./models/user.js");

const app = express();

//configuration
app.use(methodOverride("_method"));
app.use(cookieParser("secret-code"));
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, "public")));
app.engine("ejs", engine);

//session
const store = MongoStore.create({
  mongoUrl:"mongodb://127.0.0.1:27017/wanderLust",
  crypto:{
    secret: "mySuperSecret",
  },
  touchAfter: 24 * 60 * 60, // in seconds
})

store.on("error", ()=>{
  console.log("Error in storing session in mongoStore\nError: ", err);
});

const sessionOptions = {
  store,
  secret: "mySuperSecret",
  resave: false,
  saveUninitialized: true,
  cookie:{
    maxAge: 7 * 24 * 60 * 60 * 1000,
    expires: Date.now() + ( 7 * 24 * 60 * 60 * 1000),
    httpOnly: true,
  }
}
app.use(session(sessionOptions));
app.use(flash());

//must be below session middleware
app.use(passport.initialize()); // initialize passport for every requests
app.use(passport.session()); // so that all requests know their session
passport.use(new LocalStrategy(User.authenticate())); //uses static authenticate method of model in LocalStrategy
passport.serializeUser(User.serializeUser()); // store session information of user
passport.deserializeUser(User.deserializeUser()); // removes session information of user

//res.local
app.use(function(req, res, next){
  res.locals.successMsg = req.flash("success");
  res.locals.errorMsg = req.flash("error");
  res.locals.currentUser = req.user;
  next();
})

app.use("/listings/:id/review", reviewRouter);
app.use("/listings", listingRouter);
app.use("/", userRouter);


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
  const { name = anonymous } = req.cookies;
  res.cookie("color", "pink", { signed: true });
  res.send(`Hi ${name}`);
});
// app.get("/signedCookie", (req, res) => {
//   console.dir(req.signedCookies);
//   console.dir(req.cookies);
//   res.send(req.signedCookies);
// });
// app.get("/newuser", asyncWrapper( async (req, res)=>{
//   const fakeUser = new User({
//     username: "nikitaRani",
//     email: "omraja451@gmail.com",
//   });
//   const registeredUsr = await User.register(fakeUser, "#OmRaja");
//   console.log(registeredUsr);
//   res.send(registeredUsr);
// }));

//ERROR 404 page not found error handling middleware
app.all("*", (req, res, next) => {
  next(new expressError(404, "Page not found!"));
});

//error handling middleware
app.use((err, req, res, next) => {
  //first deconstruct the error object that we recieved from error handling middlewares
  const { name, status = 500, message = "Something went WRONG!" } = err;
  // console.log(name);

  res.status(status).render("error.ejs", { message });
});

// starting server
app.listen(8080, () => {
  console.log("Listening at 8080");
});
