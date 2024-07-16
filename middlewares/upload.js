const multer = require("multer");
const path = require("path");

const tmpDir = path.join(__dirname, "../", "tmp");

const multerConfig = multer.diskStorage({
  destination: tmpDir,
  filename: (req, file, cb) => {
    // Используем поля из req.body для создания нового имени файла
    const name = req.body.name;
    const article = req.body.article;
    const ext = path.extname(file.originalname);
    const timestamp = Date.now(); // Добавляем timestamp для уникальности имени файла
    const newFileName = `${name}_${article}_${timestamp}${ext}`;
    cb(null, newFileName);
  },
});

const upload = multer({
  storage: multerConfig,
});

module.exports = upload;
