import jwt from "jsonwebtoken";
import { config } from "../config/index.js";

export const generateAccessToken = (payload) =>
  jwt.sign(payload, config.accessTokenSecret, { expiresIn: config.accessTokenExpiry });

export const generateRefreshToken = (payload) =>
  jwt.sign(payload, config.refreshTokenSecret, { expiresIn: config.refreshTokenExpiry });

export const verifyAccessToken = (token) => jwt.verify(token, config.accessTokenSecret);
export const verifyRefreshToken = (token) => jwt.verify(token, config.refreshTokenSecret);

export const setRefreshTokenCookie = (res, token) => {
  res.cookie("refreshToken", token, {
    httpOnly: true,
    secure: config.env === "production",
    sameSite: "strict",
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });
};

export const clearRefreshTokenCookie = (res) => {
  res.clearCookie("refreshToken");
};
