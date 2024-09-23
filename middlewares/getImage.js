const fs = require("fs");
const path = require("path");
// const fileController = require("../helpers/FileController");
require("dotenv").config();



const getImage = async (req, res, next) => {
  const uploadDir = "./uploads";

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

    //LOCAL:
    const mainTmpDir = path.join(uploadDir, mainPhotoFile.filename);

    fs.renameSync(mainPhotoFile.path, mainTmpDir);
    req.body.mainPhoto = `/${mainTmpDir}`;

    //CLOUDINARY
    // const { path: mainTmpDir } = mainPhotoFile;
    // const { secure_url, public_id } = await fileController.upload(
    //   mainTmpDir,
    //   "images"
    // );
    // req.body.mainPhoto = secure_url;
    // req.body.imageId = public_id;
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
      //LOCAL
      const extraTmpDir = path.join(uploadDir, extraPhotoFile.filename);

      fs.renameSync(extraPhotoFile.path, extraTmpDir);
      extraPhotos.push(`/${extraTmpDir}`);

      //CLODINARY
      // const { path: extraTmpDir } = extraPhotoFile;
      // const { secure_url, public_id } = await fileController.upload(
      //   extraTmpDir,
      //   "images"
      // );
      // extraPhotos.push(secure_url);
    }

    req.body.extraPhotos = extraPhotos;
  }

  next();
};

module.exports = getImage;
