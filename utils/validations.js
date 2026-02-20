const Joi = require('joi');

const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      bookId: Joi.string().hex().length(24).required(),
      quantity: Joi.number().integer().min(1).required()
    })
  ).min(1).required(),
  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  postalCode: Joi.string().required(),
  paymentMethod: Joi.string().valid('COD', 'Online').default('COD')
});

const reviewSchema = Joi.object({
  bookId: Joi.string().hex().length(24).required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).allow('', null)
});

module.exports = {orderSchema, reviewSchema};
