const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const gallerySchema = new Schema(
  {
    title: {
      type: String,
      required: [true, "title is required"],
      minlength: 6,
      maxlength: 45,
    },
    text: {
      type: String,
      maxlength: 450,
    },
    mainPhoto: {
      type: String,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

gallerySchema.post("save", handleMongooseErr);

const addSchema = Joi.object({
  text: Joi.string().max(450),
  title: Joi.string().min(6).max(45).required("add text"),
  mainPhoto: Joi.string(),
});

const schemas = {
  addSchema,
};

const Gallery = model("gallery", gallerySchema);

module.exports = {
  Gallery,
  schemas,
};
