/**
 * Middleware kiểm tra trạng thái tài liệu.
 * Dùng khi tải xuống, hiển thị chi tiết, hạn chế xem tài liệu chưa duyệt.
 * Yêu cầu: req.document phải tồn tại và có status là 'approved', hoặc user là admin.
 */
function checkDocumentStatus(req, res, next) {
  if (req.document?.status === 'approved' || req.user?.role === 'admin') {
    return next();
  }
  return res.status(403).json({ message: 'Document not available yet' });
}

module.exports = checkDocumentStatus;