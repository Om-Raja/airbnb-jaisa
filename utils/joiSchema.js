const Joi = require("joi")
module.exports.listingSchema = Joi.object({
    listing: Joi.object({
        title: Joi.string().required().min(3),
        description: Joi.string().min(3).required(),     
        price: Joi.number().required().min(1),
        location: Joi.string().required(),
        country: Joi.string().required(),
    }).required()
});

module.exports.reviewSchema = Joi.object({
    review: Joi.object({
        rating: Joi.number().min(1).max(5).required(),
        comment: Joi.string().required(),
    }).required()
});