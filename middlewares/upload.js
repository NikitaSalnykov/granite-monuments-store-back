const multer = require("multer");
const path = require("path");
const fs = require("fs");
const sharp = require("sharp");

const tmpDir = path.join(__dirname, "../", "tmp");
if (!fs.existsSync(tmpDir)) fs.mkdirSync(tmpDir, { recursive: true });

// memoryStorage для обработки через Sharp
const storage = multer.memoryStorage();

// создаём оригинальный объект multer
const _upload = multer({
  storage,
  fileFilter: (req, file, cb) => {
    if (!file.mimetype.startsWith("image/")) return cb(new Error("Только изображения!"), false);
    cb(null, true);
  },
});

// обёртка для обработки Sharp
const wrapUpload = (multerFunc) => (req, res, next) => {
  multerFunc(req, res, async (err) => {
    if (err) return next(err);

    try {
      if (!req.file && !req.files) return next();

      // single file
      if (req.file) {
        const file = req.file;
        const ext = ".jpg";
        const baseName = path.basename(file.originalname, path.extname(file.originalname))
          .replace(/\s+/g, "_")
          .substring(0, 10);
        const timestamp = Date.now();
        const newFileName = `${baseName}_${timestamp}${ext}`;
        const outputPath = path.join(tmpDir, newFileName);

        await sharp(file.buffer).resize(1024).jpeg({ quality: 70 }).toFile(outputPath);

        req.file.path = outputPath;
        req.file.filename = newFileName;
      }

      // fields/array
      if (req.files) {
        for (const field in req.files) {
          req.files[field] = await Promise.all(
            req.files[field].map(async (file) => {
              const ext = ".jpg";
              const baseName = path.basename(file.originalname, path.extname(file.originalname))
                .replace(/\s+/g, "_")
                .substring(0, 10);
              const timestamp = Date.now();
              const newFileName = `${baseName}_${timestamp}${ext}`;
              const outputPath = path.join(tmpDir, newFileName);

              await sharp(file.buffer).resize(1024).jpeg({ quality: 70 }).toFile(outputPath);

              return { ...file, path: outputPath, filename: newFileName };
            })
          );
        }
      }

      next();
    } catch (error) {
      next(error);
    }
  });
};

// создаём объект upload с рабочими методами
const upload = {
  single: (field) => wrapUpload(_upload.single(field)),
  array: (field, maxCount) => wrapUpload(_upload.array(field, maxCount)),
  fields: (fields) => wrapUpload(_upload.fields(fields)),
};

module.exports = upload;