const mongoose = require("mongoose");
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
    }
});

//model
const Listing = mongoose.model("Listing", listingSchema);
module.exports = Listing;