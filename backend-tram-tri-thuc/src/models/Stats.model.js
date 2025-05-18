const mongoose = require("mongoose");
const { Schema } = mongoose;

const StatsSchema = new Schema({
    date: { type: Date, required: true }, // Ngày thống kê
    totalUsers: { type: Number, required: true }, // Tổng số người dùng
    totalDocuments: { type: Number, required: true }, // Tổng số tài liệu
    totalViews: { type: Number, required: true }, // Tổng số lượt xem
    totalDownloads: { type: Number, required: true }, // Tổng số lượt tải xuống
    topDocuments: [{ type: Schema.Types.ObjectId, ref: "Document" }], // Danh sách tài liệu nổi bật
    topUsers: [{ type: Schema.Types.ObjectId, ref: "User" }], // Danh sách người dùng nổi bật
});

const Stats = mongoose.model("Stats", StatsSchema);

module.exports = Stats;
