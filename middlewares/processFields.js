const upload = require("./upload");


const processFields = (req, res, next) => {
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
    { name: "extraPhotos", maxCount: 3 },
  ])(req, res, err => {
    if (err) {
      return next(err);
    }
    // Обрабатываем поля, которые должны быть в req.body для формирования имени файла
    req.body.name = req.body.name || '';
    req.body.article = req.body.article || '';
    next();
  });
};

module.exports = processFields;
