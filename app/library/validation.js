const Joi = require('@hapi/joi');

//for validating register payload
const registration = Joi.object({
    first_name: Joi.string().required(),
    last_name: Joi.string().required(),
    phone: Joi.number().required(),
    email: Joi.string().email().lowercase().required(),
    pwd: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).min(6).required(),
    address: Joi.string().required(),
    user_role: Joi.string(),
    created_on: Joi.date(),
    company_name: Joi.string(),
    uuid: Joi.string(),
    buffer: Joi.binary(),
    fileType: Joi.string(),
    verify_token: Joi.string(),
    is_verified: Joi.boolean().required(),
    is_approved: Joi.boolean()
});

//for validating signin payload
const signin = Joi.object({
    email: Joi.string().email().lowercase().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).min(6).required()
});

//for validating single product payload
const productValidate = Joi.object({
    title: Joi.string().required(),
    price: Joi.number().required(),
    quantity: Joi.number().required(),
    availiblity: Joi.string().required(),
    created_on: Joi.date(),
    color: Joi.string().required(),
    seller_id: Joi.string().required(),
    offer: Joi.string(),
    shipping_price: Joi.number(),
    category: Joi.string().required(),
    detail: Joi.string().required(),
    brand: Joi.string().required(),
    size: Joi.string().required().uppercase(),
    buffer: Joi.binary(),
    fileType: Joi.string()
});

//for validating bulk product payload
const bulkProductValidate = Joi.array().items(
    Joi.object().keys({
        title: Joi.string().required(),
        price: Joi.number().required(),
        quantity: Joi.number().required(),
        availiblity: Joi.string().required(),
        created_on: Joi.date(),
        color: Joi.string().required(),
        seller_id: Joi.string().required(),
        offer: Joi.string(),
        shipping_price: Joi.number(),
        category: Joi.string().required(),
        detail: Joi.string().required(),
        brand: Joi.string().required(),
        size: Joi.string().required().uppercase(),
        buffer: Joi.binary(),
        fileType: Joi.string()
    })
)

//for validating bulk product deletion
const bulkDeleteValidate = Joi.object({
    ids: Joi.array().items().required()
});

module.exports = {
    registration,
    productValidate,
    bulkProductValidate,
    bulkDeleteValidate,
    signin
}