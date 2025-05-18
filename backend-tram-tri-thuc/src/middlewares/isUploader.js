/**
 * Middleware kiểm tra quyền đăng tài liệu.
 * Dùng cho các route POST liên quan đến đăng tài liệu.
 * Yêu cầu: req.user phải tồn tại và có role là 'uploader' hoặc 'admin'.
 */
function isUploader(req, res, next) {
  if (['uploader', 'admin'].includes(req.user?.role)) {
    return next();
  }
  return res.status(403).json({ message: 'Uploader only' });
}

module.exports = isUploader;