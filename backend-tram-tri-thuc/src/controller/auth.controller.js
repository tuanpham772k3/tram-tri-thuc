const User = require("../models/user.model");
const bcrypt = require("bcryptjs");
const crypto = require("crypto");
const emailService = require("../services/email.service");
const {
  generateAccessToken,
  generateRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
  verifyRefreshToken,
} = require("../utils/jwt");

const { AppError, sendSuccess, asyncHandler } = require("../utils/helper");

// ====================== [POST] /register ======================
exports.register = asyncHandler(async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || typeof name !== "string" || name.trim().length === 0) {
    throw new AppError("Tên không hợp lệ.", 400);
  }

  if (!email || !isValidEmail(email)) {
    throw new AppError("Email không hợp lệ.", 400);
  }

  if (!password || password.length < 6) {
    throw new AppError("Mật khẩu phải có ít nhất 6 ký tự.", 400);
  }

  const existingUser = await User.findOne({ email });

  if (existingUser) {
    throw new AppError("Tài khoản đã tồn tại.", 400);
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  const newUser = await User.create({
    name: name.trim(),
    email,
    password: hashedPassword,
    isActive: false,
    verificationCode,
    verificationCodeExpires,
  });

  await emailService.sendVerificationCodeEmail(email, verificationCode);

  return sendSuccess(
    res,
    {
      userId: newUser._id,
      email: newUser.email,
    },
    "Đăng ký thành công! Vui lòng kiểm tra email để xác thực tài khoản.",
    201
  );
});

// ====================== [POST] /login ======================
exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    throw new AppError("Email hoặc mật khẩu không được để trống.", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Email hoặc mật khẩu không hợp lệ.", 401);
  }

  const isMatch = await bcrypt.compare(password, user.password);

  if (!isMatch) {
    throw new AppError("Email hoặc mật khẩu không hợp lệ.", 401);
  }

  if (!user.isActive) {
    throw new AppError("Tài khoản của bạn đã bị vô hiệu hóa.", 403);
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  const refreshToken = generateRefreshToken({
    id: user._id,
  });

  user.refreshToken = refreshToken;
  await user.save();

  setRefreshTokenCookie(res, refreshToken);

  return sendSuccess(
    res,
    {
      user: {
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
        isVip: user.isVip,
      },
      accessToken,
    },
    "Đăng nhập thành công!"
  );
});

// ====================== [POST] /forgot-password ======================
exports.forgotPassword = asyncHandler(async (req, res) => {
  const { email } = req.body;

  if (!email) {
    throw new AppError("Email không được để trống.", 400);
  }

  const user = await User.findOne({ email });

  if (!user) {
    throw new AppError("Không tìm thấy tài khoản với email này.", 404);
  }

  if (!user.isActive) {
    throw new AppError("Tài khoản của bạn đã bị vô hiệu hóa.", 403);
  }

  const passwordResetToken = crypto.randomBytes(32).toString("hex");

  const passwordResetTokenExpires = new Date(Date.now() + 1000 * 60 * 10);

  user.passwordResetToken = passwordResetToken;
  user.passwordResetTokenExpires = passwordResetTokenExpires;

  await user.save();

  const resetLink = `${process.env.CLIENT_URL}/reset-password?token=${passwordResetToken}`;

  await emailService.sendResetPasswordEmail(email, resetLink);

  return sendSuccess(res, {}, "Link đặt lại mật khẩu đã được gửi tới email của bạn.");
});

// ====================== [POST] /reset-password ======================
exports.resetPassword = asyncHandler(async (req, res) => {
  const { token, newPassword } = req.body;

  if (!token) {
    throw new AppError("Token không được để trống.", 400);
  }

  if (!newPassword || newPassword.length < 6) {
    throw new AppError("Mật khẩu mới phải có ít nhất 6 ký tự.", 400);
  }

  const user = await User.findOne({
    passwordResetToken: token,
    passwordResetTokenExpires: { $gt: Date.now() },
  });

  if (!user) {
    throw new AppError("Token không hợp lệ hoặc đã hết hạn.", 400);
  }

  const hashedPassword = await bcrypt.hash(newPassword, 10);

  user.password = hashedPassword;
  user.passwordResetToken = null;
  user.passwordResetTokenExpires = null;

  await user.save();

  return sendSuccess(res, {}, "Mật khẩu được đặt lại thành công!");
});

// ====================== [POST] /refresh-token ======================
exports.refreshToken = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Thiếu refreshToken.", 400);
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError("RefreshToken không hợp lệ.", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("RefreshToken không hợp lệ hoặc đã bị thu hồi.", 403);
  }

  const accessToken = generateAccessToken({
    id: user._id,
    role: user.role,
  });

  return sendSuccess(res, { accessToken }, "Làm mới token thành công.");
});

// ====================== [POST] /logout ======================
exports.logout = asyncHandler(async (req, res) => {
  const refreshToken = req.cookies.refreshToken;

  if (!refreshToken) {
    throw new AppError("Phiên đăng nhập không hợp lệ hoặc đã hết hạn.", 400);
  }

  const decoded = verifyRefreshToken(refreshToken);

  if (!decoded) {
    throw new AppError("RefreshToken không hợp lệ.", 401);
  }

  const user = await User.findById(decoded.id);

  if (!user || user.refreshToken !== refreshToken) {
    throw new AppError("RefreshToken không hợp lệ.", 403);
  }

  user.refreshToken = null;
  await user.save();

  clearRefreshTokenCookie(res);

  return sendSuccess(res, {}, "Đăng xuất thành công.");
});

// ====================== [POST] /verify-email ======================
exports.verifyEmail = asyncHandler(async (req, res) => {
  const { userId, verificationCode } = req.body;

  if (!verificationCode || verificationCode.length !== 6) {
    throw new AppError("Mã xác thực phải có 6 ký tự.", 400);
  }

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Không tìm thấy tài khoản với email này.", 404);
  }

  if (user.isActive) {
    throw new AppError("Email đã được xác thực.", 400);
  }

  if (
    !user.verificationCode ||
    user.verificationCode !== verificationCode ||
    !user.verificationCodeExpires ||
    user.verificationCodeExpires < Date.now()
  ) {
    throw new AppError("Mã xác thực không hợp lệ hoặc đã hết hạn.", 400);
  }

  user.isActive = true;
  user.verificationCode = null;
  user.verificationCodeExpires = null;

  await user.save();

  return sendSuccess(
    res,
    {},
    "Xác thực email thành công! Bạn có thể đăng nhập ngay bây giờ."
  );
});

// ====================== [POST] /resend-verification ======================
exports.resendVerificationEmail = asyncHandler(async (req, res) => {
  const { userId } = req.body;

  const user = await User.findById(userId);

  if (!user) {
    throw new AppError("Không tìm thấy tài khoản.", 404);
  }

  if (user.isActive) {
    throw new AppError("Email đã được xác thực.", 400);
  }

  const verificationCode = Math.floor(100000 + Math.random() * 900000).toString();

  const verificationCodeExpires = new Date(Date.now() + 10 * 60 * 1000);

  user.verificationCode = verificationCode;
  user.verificationCodeExpires = verificationCodeExpires;

  await user.save();

  await emailService.sendVerificationCodeEmail(user.email, verificationCode);

  return sendSuccess(
    res,
    {},
    "Email xác thực đã được gửi lại. Vui lòng kiểm tra hộp thư."
  );
});
