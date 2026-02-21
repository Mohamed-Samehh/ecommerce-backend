const Joi = require('joi');

const mongoId = Joi.string().hex().length(24);

const orderSchema = Joi.object({
  items: Joi.array().items(
    Joi.object({
      bookId: mongoId.required(),
      quantity: Joi.number().min(1).required()
    })
  ).min(1).required(),

  country: Joi.string().required(),
  city: Joi.string().required(),
  street: Joi.string().required(),
  postalCode: Joi.string().required(),

  paymentMethod: Joi.string().valid('COD', 'Online').required()
});

const reviewSchema = Joi.object({
  bookId: mongoId.required(),
  rating: Joi.number().integer().min(1).max(5).required(),
  comment: Joi.string().max(500).allow('')
});

const statusSchema = Joi.object({
  status: Joi.string()
    .valid('processing', 'out for delivery', 'delivered')
    .required()
});

const paymentSchema = Joi.object({
  paymentStatus: Joi.string().valid('pending', 'success').required()
});

const bookSchema = Joi.object({
  name: Joi.string()
    .alphanum()
    .min(5)
    .max(200)
    .required()
    .trim(true),
  coverImage: Joi.string()
    .pattern(/^https?:\/\/(www\.)?[-\w@:%.+~#=]{1,256}\.[a-zA-Z]{2,6}\b([-\w@:%+.~#?&/=]*)$/)
    .message('invalid url')
    .required(),
  price: Joi.number()
    .required(),
  stock: Joi.number()
    .min(0)
    .default(0),

  authorId: Joi.string()
    .required(),

  categories: Joi.array()
    .items(Joi.string())
    .required(),

  description: Joi.string()
    .min(5)
    .max(2000)
    .trim()
    .required()
});
module.exports = {
  orderSchema,
  reviewSchema,
  statusSchema,
  paymentSchema,
  bookSchema
};
