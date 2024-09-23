const fs = require("fs");
const path = require("path");
const { Product } = require("../models/product");
const { HttpError } = require("../helpers");

const uploadDir = path.join(__dirname, "../", "uploads"); // Путь к папке загрузок

const deleteFiles = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) throw HttpError(404, "Not found");

  if (product.mainPhoto) {
    const filePath = path.join(uploadDir, path.basename(product.mainPhoto));
    try {
      if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
    }
    } catch (error) {
      console.error(`Failed to delete file at ${filePath}:`, error.message);
    }
  }

  if (product.extraPhotos && product.extraPhotos.length > 0) {
    for (const photo of product.extraPhotos) {
      const filePath = path.join(uploadDir, path.basename(photo));
      try {
        if (fs.existsSync(filePath)) {
          fs.unlinkSync(filePath);
      }
      } catch (error) {
        console.error(`Failed to delete file at ${photoPath}:`, error.message);
      }
    }
  }

  next();
};

module.exports = deleteFiles;