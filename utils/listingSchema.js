const Joi = require("joi")
const listingSchema = Joi.object({
    title: Joi.string().required().min(3),
    description: Joi.string().min(3).required(),
    image: Joi.string().allow("", null),
    price: Joi.number().required().min(1),
    location: Joi.string().required(),
    country: Joi.string().required().alphanum(),
})

module.exports = listingSchema