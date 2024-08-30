const upload = require("./upload");


const processFieldsGallery = (req, res, next) => {
  upload.fields([
    { name: "mainPhoto", maxCount: 1 },
  ])(req, res, err => {
    if (err) {
      return next(err);
    }
    req.body.title = req.body.title || '';
    next();
  });
};

module.exports = processFieldsGallery;
