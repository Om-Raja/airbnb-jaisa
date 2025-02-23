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