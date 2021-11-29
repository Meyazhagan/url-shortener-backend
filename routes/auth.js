const router = require("express").Router();
const auth = require("../services/auth.services");

router.post("/login", auth.login);
router.post("/register", auth.register);
router.post("/resend-verification", auth.resendVerification);
router.post("/forgot-password", auth.forgot);
router.post("/reset-password", auth.reset);
router.get("/verify/:token", auth.verifyUser);
router.get("/verify-reset/:token", auth.verifyResetPassword);

module.exports = router;
