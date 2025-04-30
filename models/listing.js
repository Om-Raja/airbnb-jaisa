const mongoose = require("mongoose");
const Review = require("./reviews");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    filename: String,
    url: String,
})
const listingSchema = new Schema({
    title:{
        type: String,
        required: true,
    },
    description:{
        type: String,
    },
    image:{
        url: String,
        filename: String,
    },
    price:{
        type: Number,
    },
    location:{
        type: String,
        required: true,
    },
    country:{
        type:String,
        required: true,
    },
    reviews:[{
        type: Schema.Types.ObjectId,
        ref: 'Review', //No, you do not need to import the Review model in the listing.js file to use it as a reference in the schema
    }],
    owner:{
        type: Schema.Types.ObjectId,
        ref: "User",
    }
});

//post hook / mongoose middleware
listingSchema.post("findOneAndDelete", async function(listing){
    if(listing) await Review.deleteMany({_id: {$in: listing.reviews}});
    
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;