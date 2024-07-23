const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/products");
const getImage = require("../../middlewares/getImage");
const upload = require("../../middlewares/upload");
const processFields = require("../../middlewares/processFields");
const { validateBody, isValidId, authenticate } = require("../../middlewares");
const { schemas } = require("../../models/product");
const deleteFiles = require("../../middlewares/deleteFiles");

router.get("/", ctrl.getAll);


router.get("/:productId", isValidId, ctrl.getById);

router.post(
  "/",
  processFields,
  validateBody(schemas.addSchema),
  getImage,
  ctrl.addProduct
);

router.delete("/:productId", isValidId,  deleteFiles, ctrl.deleteProduct);

router.patch(
  "/:productId",
  processFields,
  isValidId,
  validateBody(schemas.updateSchema),
  getImage,
  ctrl.updateProduct
);

router.patch(
  "/:productId/availability",
  isValidId,
  validateBody(schemas.updateAvailabilitySchema),
  ctrl.updateAvailability
);

module.exports = router;
