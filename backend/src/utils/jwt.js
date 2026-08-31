const jwt = require("jsonwebtoken");

const generateAccessToken = (payload) =>
  jwt.sign(payload, process.env.ACCESS_TOKEN_SECRET, {
    expiresIn: process.env.ACCESS_TOKEN_EXPIRES,
  });

const generateRefreshToken = (payload) =>
  jwt.sign(payload, process.env.REFRESH_TOKEN_SECRET, {
    expiresIn: process.env.REFRESH_TOKEN_EXPIRES,
  });

const verifyAccessToken = (token) => jwt.verify(token, process.env.ACCESS_TOKEN_SECRET);
const verifyRefreshToken = (token) => jwt.verify(token, process.env.REFRESH_TOKEN_SECRET);

const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken");
};

module.exports = {
  generateAccessToken,
  generateRefreshToken,
  verifyAccessToken,
  verifyRefreshToken,
  setRefreshTokenCookie,
  clearRefreshTokenCookie,
};
