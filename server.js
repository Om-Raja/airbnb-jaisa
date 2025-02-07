const express = require("express");
const path = require("path"); // no need to install
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();

//configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));
app.use(methodOverride("_method"));


//database connection
const MONGO_URL = "mongodb://127.0.0.1:27017/wanderLust";
async function main(){
    await mongoose.connect(MONGO_URL);
}
main().then(()=>{
    console.log("Database connnected successfully");
}).catch((err)=>{
    console.log(err);
});

//APIs
app.get("/", (req, res)=>{
    res.send("I'm groot");
});

//index route
app.get("/listings", async (req, res)=>{
    const allListing = await Listing.find({});
    // res.send("working");
    res.render("listings/index.ejs", {allListing});
});
app.post("/listings", async (req, res)=>{
    const newListing = new Listing(req.body.listing);
    await newListing.save();
    
    res.redirect("/listings");
});
app.put("/listings/:id", async(req, res)=>{
    const {id} = req.params;
    const newListing = req.body.listing;
    const list = await Listing.findByIdAndUpdate(id, {...newListing}); //destrucured

    //redirecting to show route
    res.redirect(`/listings/${id}`);

})

//create route

// written before /listing/:id otherwise server would consider 'new' is an id
app.get("/listings/new", (req, res)=>{
    res.render("listings/new.ejs");
});

//show route
app.get("/listings/:id", async(req, res)=>{
    const {id} = req.params;
    let list = await Listing.findById(id);
    res.render("listings/show.ejs", {list});
});

app.get("/listings/:id/edit", async (req, res)=>{
    const {id} = req.params;
    const list = await Listing.findById(id);
    res.render("listings/edit.ejs", {list});
});




// starting server
app.listen(8080, ()=>{
    console.log("Listening at 8080");
});
