const express = require("express");
const path = require("path"); // no need to install
const mongoose = require("mongoose");
const Listing = require("./models/listing");
const app = express();

//configuration
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "./views"));
app.use(express.json());
app.use(express.urlencoded({extended: true}));


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

app.get("/listings", async (req, res)=>{
    const allListing = await Listing.find({});
    // res.send("working");
    res.render("listings/index.ejs", {allListing});
});




// starting server
app.listen(8080, ()=>{
    console.log("Listening at 8080");
});
