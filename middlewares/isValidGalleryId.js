const { isValidObjectId } = require("mongoose");
const { HttpError } = require("../helpers");

const isValidGalleryId = (req, res, next) => {
  const { galleryId } = req.params;
  if (!isValidObjectId(galleryId)) {
    next(HttpError(400, `${galleryId} is not valid id`));
  }
  next();
};

module.exports = isValidGalleryId;
