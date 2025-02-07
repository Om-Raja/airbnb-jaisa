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
    // image:{
    //     type: imageSchema,
    //     default: {
    //         filename: "testImage",
    //         url: "https://unsplash.com/photos/a-man-standing-on-top-of-a-mountain-next-to-a-lake-BcWAKeBRbvE",
    //     },
    //     // set: (v)=>{
    //     //     return (v === "")?"https://unsplash.com/photos/a-man-standing-on-top-of-a-mountain-next-to-a-lake-BcWAKeBRbvE":v
    //     // },
    // },
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