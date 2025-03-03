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
        type:String,
        default: "https://media.istockphoto.com/id/531864277/photo/bandra-worli-sea-link.jpg?s=2048x2048&w=is&k=20&c=1eiA8c7XF-Tssv9AgxwGDHVQD8qUjDHHSZw85WkneJg=",
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
});

//post hook / mongoose middleware
listingSchema.post("findOneAndDelete", async function(listing){
    if(listing) await Review.deleteMany({_id: {$in: listing.reviews}});
    
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;