const multer = require("multer");
const path = require("path");

const tmpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {


    const ext = path.extname(file.originalname); // Получаем расширение файла (например, .jpg)

    const baseName = path.basename(file.originalname, ext); // Получаем имя файла без расширения

    const timestamp = Date.now(); // Добавляем timestamp для уникальности имени файла
    const newFileName = `${baseName.replace(/\s+/g, "_").substring(0, 10)}_${timestamp}${ext}`; // Формируем новое имя без повторного добавления расширения

    cb(null, newFileName);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
