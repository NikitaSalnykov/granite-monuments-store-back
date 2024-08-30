const express = require("express");
const router = express.Router();
const { validateBody } = require("../../middlewares");
const { schemas } = require("../../models/user");
const ctrl = require("../../controllers/auth");
const { authenticate } = require("../../middlewares");

router.post("/register", validateBody(schemas.registerSchema), ctrl.register);
router.get("/verify/:verificationToken", ctrl.verifyEmail);
router.post(
  "/verify",
  validateBody(schemas.emailSchema),
  ctrl.resendVerifyEmail
);
router.post("/login", validateBody(schemas.loginSchema), ctrl.login);
router.post("/logout", authenticate, ctrl.logout);
router.get("/current", authenticate, ctrl.current);
router.patch(
  "/users",
  authenticate,
  validateBody(schemas.updateRoleSchema),
  ctrl.updateRole
);
router.post("/refresh", validateBody(schemas.refreshSchema), ctrl.refresh);
router.patch(
  "/",
  authenticate,
  validateBody(schemas.updateSchema),
  ctrl.update
);


module.exports = router;
