const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidReviewId = (req, res, next) => {
  const { reviewId } = req.params;
  if (!isValidObjectId(reviewId)) {
    next(HttpError(400, `${reviewId} is not valid id`));
  }
  next();
};

module.exports = isValidReviewId;
