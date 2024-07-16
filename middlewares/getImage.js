const fs = require("fs");
const path = require("path");

const getImage = async (req, res, next) => {
  const uploadDir = path.join(__dirname, "../uploads");

  // Создаем папку для загрузок, если ее не существует
  if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
  }

  // Проверяем наличие mainPhoto в запросе
  if (
    req.files &&
    req.files["mainPhoto"] &&
    req.files["mainPhoto"].length > 0
  ) {
    const mainPhotoFile = req.files["mainPhoto"][0];
    const mainTmpDir = path.join(uploadDir, mainPhotoFile.filename);

    fs.renameSync(mainPhotoFile.path, mainTmpDir);
    req.body.mainPhoto = mainTmpDir;
  }

  // Проверяем наличие extraPhotos в запросе
  if (
    req.files &&
    req.files["extraPhotos"] &&
    req.files["extraPhotos"].length > 0
  ) {
    const extraPhotos = [];

    // Проходим по всем файлам extraPhotos и асинхронно обрабатываем каждый
    for (const extraPhotoFile of req.files["extraPhotos"]) {
      const extraTmpDir = path.join(uploadDir, extraPhotoFile.filename);

      fs.renameSync(extraPhotoFile.path, extraTmpDir);
      extraPhotos.push(extraTmpDir);
    }

    req.body.extraPhotos = extraPhotos;
  }

  next();
};

module.exports = getImage;
