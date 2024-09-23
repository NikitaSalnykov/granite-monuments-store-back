const fs = require("fs");
const path = require("path");
const { Gallery } = require("../models/gallery");
const { HttpError } = require("../helpers");

const uploadDir = path.join(__dirname, "../", "uploads"); // Путь к папке загрузок

const deletePhoto = (req, res, next) => {
  const { galleryId } = req.params;
  Gallery.findById(galleryId)
    .then(gallery => {
      console.log(gallery);
      if (!gallery) throw HttpError(404, "Not found");
      console.log(gallery.mainPhoto);
      if (gallery.mainPhoto) {
        const filePath = path.join(uploadDir, path.basename(gallery.mainPhoto));
        console.log(filePath);

        try {
          if (fs.existsSync(filePath)) {
            fs.unlinkSync(filePath);
            console.log(`Файл ${filePath} успешно удален.`);
          } else {
            console.error(`Файл по пути ${filePath} не найден.`);
          }
        } catch (error) {
          console.error(`Не удалось удалить файл по пути ${filePath}:`, error.message);
        }
      }

      next();
    })
    .catch(next);
};

module.exports = deletePhoto;
