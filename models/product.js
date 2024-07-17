const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const productSchema = new Schema(
  {
    name: {
      ua: { type: String, required: true },
      ru: { type: String, required: true },
    },
    category: {
      type: String,
      required: true,
    },
    type: {
      type: String,
      required: true,
    },
    price: {
      type: String,
      required: true,
    },
    discount: {
      type: Number,
      default: 0,
      min: 0,
      max: 100,
    },
    description: {
      ua: { type: String, required: true },
      ru: { type: String, required: true },
    },
    article: {
      type: String,
    },
    mainPhoto: {
      type: String,
    },
    extraPhotos: [
      {
        type: String,
      },
    ],
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

productSchema.post("save", handleMongooseErr);

const addSchema = Joi.object({
  name: Joi.object({
    ua: Joi.string().required(),
    ru: Joi.string().required(),
  }).required(),
  category: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.string().required(),
  discount: Joi.number().min(0).max(100),
  description: Joi.object({
    ua: Joi.string().required(),
    ru: Joi.string().required(),
  }).required(),
  article: Joi.string(),
  mainPhoto: Joi.string(),
  extraPhotos: Joi.array().items(Joi.string()),
});

const updateSchema = Joi.object({
  name: Joi.object({
    ua: Joi.string(),
    ru: Joi.string(),
  }),
  category: Joi.string(),
  type: Joi.string(),
  price: Joi.string(),
  discount: Joi.number().min(0).max(100).default(0),
  description: Joi.object({
    ua: Joi.string(),
    ru: Joi.string(),
  }),
  article: Joi.string(),
  mainPhoto: Joi.string(),
  extraPhotos: Joi.array().items(Joi.string()),
}).or('name', 'category', 'type', 'price', 'discount', 'description', 'article', 'mainPhoto', 'extraPhotos');

const schemas = {
  addSchema,
  updateSchema,
};

const Product = model("Product", productSchema);

module.exports = {
  Product,
  schemas,
};
