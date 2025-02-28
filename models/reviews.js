const mongoose = require("mongoose");
const {Schema} = mongoose;

const reviewSchema = new Schema({
    rating:{
        type: Number,
        min: 1,
        max: 5,
    },
    comment:{
        type: String,
    }
})
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;