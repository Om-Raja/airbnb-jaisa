const mongoose = require("mongoose");
const { Schema } = mongoose;

const reviewSchema = new Schema({
  rating: {
    type: Number,
    min: 1,
    max: 5,
    required: true,
  },
  comment: {
    type: String,
    required: true,
  },
  owner:{
    type: Schema.Types.ObjectId,
    ref: "User", //string form me model name
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});
const Review = mongoose.model("Review", reviewSchema);
module.exports = Review;
