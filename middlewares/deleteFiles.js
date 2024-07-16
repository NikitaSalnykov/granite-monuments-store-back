const fs = require("fs").promises;
const path = require("path");
const { Product } = require("../models/product");
const { HttpError } = require("../helpers");

const uploadDir = path.join(__dirname, "../", "uploads"); // Путь к папке загрузок

const deleteFiles = async (req, res, next) => {
  const { productId } = req.params;
  const product = await Product.findById(productId);
  if (!product) throw HttpError(404, "Not found");

  if (product.mainPhoto) {
    const mainPhotoPath = path.join(uploadDir, path.basename(product.mainPhoto));
    try {
      await fs.unlink(mainPhotoPath);
    } catch (error) {
      console.error(`Failed to delete file at ${mainPhotoPath}:`, error.message);
    }
  }

  if (product.extraPhotos && product.extraPhotos.length > 0) {
    for (const photo of product.extraPhotos) {
      const photoPath = path.join(uploadDir, path.basename(photo));
      try {
        await fs.unlink(photoPath);
      } catch (error) {
        console.error(`Failed to delete file at ${photoPath}:`, error.message);
      }
    }
  }

  next();
};

module.exports = deleteFiles;