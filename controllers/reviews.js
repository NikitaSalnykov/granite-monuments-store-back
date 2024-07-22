const { HttpError } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const { Review } = require("../models/review");

const getAll = async (req, res) => {
  let result;
  result = await Review.find();
  res.json(result);
};

const getById = async (req, res, next) => {
  const { reviewId } = req.params;
  const result = await Review.findById(reviewId);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const addReview = async (req, res, next) => {
  const result = await Review.create({ ...req.body });

  res.json({ message: "Add success" });
};

const deleteReview = async (req, res, next) => {
  const { reviewId } = req.params;
  const result = await Review.findByIdAndDelete(reviewId);
  if (!result) throw HttpError(404, "Not found");
  res.json({ message: "Delete success" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addReview: ctrlWrapper(addReview),
  deleteReview: ctrlWrapper(deleteReview),
};
