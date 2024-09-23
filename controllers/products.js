const { Product } = require("../models/product");
const { HttpError } = require("../helpers");
const ctrlWrapper = require("../helpers/ctrlWrapper");

const getAll = async (req, res) => {

  let result;

  result = await Product.find();

  res.json(result);
};

const getById = async (req, res, next) => {
  const { productId } = req.params;
  const result = await Product.findById(productId);
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const addProduct = async (req, res, next) => {
  try {
    const result = await Product.create({ ...req.body });
    console.log(result);
    return res.status(201).json({ message: "Add success" });
  } catch (err) {
    return res.status(500).json(err)
  }
};

const deleteProduct = async (req, res, next) => {
  const { productId } = req.params;
  const result = await Product.findByIdAndDelete(productId);
  if (!result) throw HttpError(404, "Not found");
  res.json({ message: "Delete success" });
};

const updateProduct = async (req, res, next) => {
  const { productId } = req.params;
  const result = await Product.findByIdAndUpdate(
    productId,
    { ...req.body },
    {
      new: true,
    }
  );
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};

const updateAvailability = async (req, res, next) => {
  const { productId } = req.params;
  const result = await Product.findByIdAndUpdate(productId, req.body, {
    new: true,
  });
  if (!result) throw HttpError(404, "Not found");
  res.json(result);
};


module.exports = {
  getAll: ctrlWrapper(getAll),
  getById: ctrlWrapper(getById),
  addProduct: ctrlWrapper(addProduct),
  deleteProduct: ctrlWrapper(deleteProduct),
  updateProduct: ctrlWrapper(updateProduct),
  updateAvailability: ctrlWrapper(updateAvailability)
};
