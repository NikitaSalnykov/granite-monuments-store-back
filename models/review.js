const { Schema, model } = require("mongoose");
const Joi = require("joi");
const { handleMongooseErr } = require("../helpers");

const reviewSchema = new Schema(
  {
    author: {
      type: String,
      required: [true, "author is required"],
      minlength: 2,
    },
    text: {
      type: String,
      required: [true, "review is required"],
      minlength: 40,
      maxlength: 450,
    },
  },
  {
    versionKey: false,
    timestamps: true,
  }
);

reviewSchema.post("save", handleMongooseErr);

const addSchema = Joi.object({
  text: Joi.string().min(40).max(450).required("add text"),
  author: Joi.string().required("add author"),
});


const schemas = {
  addSchema,
};

const Review = model("review", reviewSchema);

module.exports = {
  Review,
  schemas,
};
