const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMangooseErr } = require("../helpers");

const productSchema = new Schema(
  {
    name: {
      type: String,
    },
    category: {
      type: String,
    },
    type: {
      type: String,
    },
    price: {
      type: String,
    },
    discount: {
      type: Number,
      default: 0,
    },
    description: {
      type: String,
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

productSchema.post("save", handleMangooseErr);

const addSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string().required(),
  type: Joi.string().required(),
  price: Joi.string().required(),
  discount: Joi.number().min(0).max(100),
  description: Joi.string(),
  article: Joi.string(),
  // mainPhoto: Joi.string(),
  // extraPhotos: Joi.array().items(Joi.string()),
});

const updateSchema = Joi.object({
  name: Joi.string().required(),
  category: Joi.string(),
  type: Joi.string(),
  price: Joi.string(),
  discount: Joi.number().min(0).max(100).default(0),
  description: Joi.string(),
  article: Joi.string(),
});

const schemas = {
  addSchema,
  updateSchema,
};

const Product = model("product", productSchema);

module.exports = {
  Product,
  schemas,
};
