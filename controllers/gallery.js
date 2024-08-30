const { HttpError } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");
const { Gallery } = require("../models/gallery");

const getAll = async (req, res) => {
  let result;
  result = await Gallery.find();
  res.json(result);
};

const getById = async (req, res, next) => {
  const { galleryId } = req.params;
  const result = await Gallery.findById(galleryId);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const addGallery = async (req, res, next) => {
  const result = await Gallery.create({ ...req.body });

  res.json({ message: "Add success" });
};

const deleteGallery = async (req, res, next) => {
  const { galleryId } = req.params;
  const result = await Gallery.findByIdAndDelete(galleryId);
  if (!result) throw HttpError(404, "Not found");
  res.json({ message: "Delete success" });
};

module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addGallery: ctrlWrapper(addGallery),
  deleteGallery: ctrlWrapper(deleteGallery),
};
