const Joi = require('joi');
module.exports.listingValidation = Joi.object({
    title: Joi.string().required(),
    description: Joi.string().required(),
    price: Joi.number().required().min(0),
    location: Joi.string().required(),
    country : Joi.string().required(),
    img: Joi.string().allow("", null)
});

module.exports.reviewValidate = Joi.object({
    comment : Joi.string().required(),
    rating : Joi.number().required().min(1).max(5)
    // createdAt : Joi.date()
})


module.exports.userValidation = Joi.object({
    username : Joi.string().required(),
    password : Joi.string().required(),
    email : Joi.string().required()
})

