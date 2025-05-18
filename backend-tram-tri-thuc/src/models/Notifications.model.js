const mongoose = require("mongoose");
const { Schema } = mongoose;

const NotificationSchema = new Schema({
    userId: { type: Schema.Types.ObjectId, ref: "User", required: true }, // Tham chiếu đến người dùng nhận thông báo
    type: {
        type: String,
        enum: ["document_approved", "comment", "system"],
        required: true,
    }, // Loại thông báo
    content: { type: String, required: true }, // Nội dung thông báo
    link: { type: String, required: false }, // Đường dẫn liên kết (nếu có)
    isRead: { type: Boolean, default: false }, // Trạng thái đã đọc
    createdAt: { type: Date, default: Date.now }, // Ngày tạo thông báo
});

const Notification = mongoose.model("Notification", NotificationSchema);

module.exports = Notification;
