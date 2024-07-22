const express = require("express");
const router = express.Router();
const ctrl = require("../../controllers/reviews");
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/review");
const getImage = require("../../middlewares/getImage");
const isValidReviewId = require("../../middlewares/isValidReviewId");

router.get("/", ctrl.getAll);
router.get("/:reviewId", isValidReviewId, ctrl.getById);
router.post("/", validateBody(schemas.addSchema), ctrl.addReview);
router.delete("/:reviewId", isValidReviewId, ctrl.deleteReview);

module.exports = router;
