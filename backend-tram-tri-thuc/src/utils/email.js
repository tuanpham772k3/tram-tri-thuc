const nodemailer = require("nodemailer");
const logger = require("./logger");

// Tạo transporter dùng chung cho tất cả email
const createTransporter = () => {
    if (!process.env.EMAIL_USER || !process.env.EMAIL_PASS) {
        throw new Error("Thiếu biến môi trường EMAIL_USER hoặc EMAIL_PASS");
    }

    return nodemailer.createTransport({
        service: "Gmail",
        pool: true, // Sử dụng connection pool để tối ưu
        maxConnections: 5, // Giới hạn số kết nối đồng thời
        maxMessages: 100, // Giới hạn số email mỗi kết nối
        auth: {
            user: process.env.EMAIL_USER,
            pass: process.env.EMAIL_PASS,
        },
    });
};

// Hàm chung để gửi email
const sendEmail = async ({ to, subject, html }) => {
    const transporter = createTransporter();

    try {
        // Kiểm tra kết nối SMTP trước khi gửi
        await transporter.verify();
        logger.info(`Kết nối SMTP xác minh thành công cho ${process.env.EMAIL_USER}`);

        // Gửi email
        await transporter.sendMail({
            from: `"Trạm Tri Thức" <${process.env.EMAIL_USER}>`,
            to,
            subject,
            html,
        });

        logger.info(`Gửi email thành công tới ${to}`, { subject });
    } catch (error) {
        logger.error(`Gửi email thất bại tới ${to}`, {
            subject,
            error: error.message,
            smtpCode: error.code,
            smtpResponse: error.response,
        });
        throw new Error(`Gửi email thất bại: ${error.message}`);
    }
};

// Gửi email xác minh tài khoản
const sendVerificationEmail = async (email, token) => {
    const link = `${process.env.CLIENT_URL}/verify?token=${token}`;
    const html = `
        <h3>Xin chào!</h3>
        <p>Vui lòng <a href="${link}">nhấn vào đây</a> để xác thực email của bạn.</p>
        <p>Link sẽ hết hạn sau 24 giờ.</p>
        <p>Trân trọng,<br/>Trạm Tri Thức</p>
    `;

    await sendEmail({
        to: email,
        subject: "Xác thực email cho Trạm Tri Thức",
        html,
    });
};

// Gửi email đặt lại mật khẩu
const sendResetPasswordEmail = async (email, resetLink) => {
    const html = `
        <h3>Xin chào!</h3>
        <p>Vui lòng <a href="${resetLink}">nhấn vào đây</a> để đặt lại mật khẩu của bạn.</p>
        <p>Link sẽ hết hạn sau 10 phút.</p>
        <p>Trân trọng,<br/>Trạm Tri Thức</p>
    `;

    await sendEmail({
        to: email,
        subject: "Đặt lại mật khẩu cho Trạm Tri Thức",
        html,
    });
};

// Gửi thông báo chia sẻ tài liệu
const sendShareNotification = async (to, documentName, permission, customMessage = null) => {
    const permissionText = permission === "editor" ? "Chỉnh sửa" : "Chỉ xem";
    const message =
        customMessage ||
        `Tài liệu <b>${documentName}</b> đã được chia sẻ với bạn với quyền <b>${permissionText}</b>.`;
    const html = `
        <h3>Xin chào!</h3>
        <p>${message}</p>
        <p>Truy cập <a href="${process.env.CLIENT_URL}/shared-with-me">Trạm Tri Thức</a> để xem tài liệu.</p>
        <p>Trân trọng,<br/>Trạm Tri Thức</p>
    `;

    await sendEmail({
        to,
        subject: `Tài liệu "${documentName}" đã được chia sẻ với bạn`,
        html,
    });
};

module.exports = {
    sendVerificationEmail,
    sendResetPasswordEmail,
    sendShareNotification,
};
