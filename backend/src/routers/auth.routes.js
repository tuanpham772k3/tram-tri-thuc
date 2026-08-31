const express = require("express");
const authenticate = require("../middlewares/auth.middleware");
const { forgotPasswordLimiter, loginLimiter } = require("../utils/rateLimit");
const {
  register,
  forgotPassword,
  resetPassword,
  login,
  refreshToken,
  logout,
  verifyEmail,
  resendVerificationEmail,
} = require("../controller/auth.controller");

const router = express.Router();

router.post("/register", register);
router.post("/login", loginLimiter, login);
router.post("/logout", authenticate, logout);

router.post("/refresh-token", refreshToken);

router.post("/forgot-password", forgotPasswordLimiter, forgotPassword);
router.post("/reset-password", resetPassword);

router.post("/verify-email", verifyEmail);
router.post("/resend-verification", resendVerificationEmail);

module.exports = router;
