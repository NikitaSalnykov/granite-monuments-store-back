const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/gallery");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/gallery");
const getImage = require("../../middlewares/getImage");
const isValidGalleryId = require("../../middlewares/isValidGalleryId");
const processFieldsGallery = require("../../middlewares/processFieldsGallery");

router.get("/", ctrl.getAll);
router.get("/:galleryId", isValidGalleryId, ctrl.getById);
router.post("/",   processFieldsGallery, validateBody(schemas.addSchema),   getImage, ctrl.addGallery);
router.delete("/:galleryId", isValidGalleryId, ctrl.deleteGallery);

module.exports = router;
