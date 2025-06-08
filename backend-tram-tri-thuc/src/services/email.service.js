const nodemailer = require("nodemailer");
const logger = require("../utils/logger");

const transporter = nodemailer.createTransport({
    service: "Gmail",
    auth: {
        user: process.env.EMAIL_USER, // Ví dụ: your-email@gmail.com
        pass: process.env.EMAIL_PASS, // App Password từ Gmail
    },
});

// Xác minh transporter khi khởi tạo ứng dụng (1 lần)
(async () => {
    try {
        await transporter.verify();
        logger.info("Email transporter verified and ready to send emails.");
    } catch (error) {
        logger.error("Email transporter verification failed:", error);
    }
})();

/**
 * Gửi mã xác thực email sau khi đăng ký
 * @param {string} email - Email người dùng đăng ký
 * @param {string} verificationCode - Mã xác thực email
 */
exports.sendVerificationCodeEmail = async (email, verificationCode) => {
    const mailOptions = {
        from: `"Thư viện tài liệu" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Xác thực email đăng ký",
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                    <h1 style="color: #2c3e50; text-align: center;">Xác thực Email</h1>
                    <p>Xin chào,</p>
                    <p>Cảm ơn bạn đã đăng ký tài khoản tại <strong>Thư viện tài liệu</strong>.</p>
                    <p>Đây là mã xác thực của bạn:</p>
                    <div style="text-align: center; padding: 20px;">
                        <h2 style="color: #007bff; font-size: 30px; letter-spacing: 5px; background: #f8f9fa; padding: 10px; border-radius: 5px;">
                            ${verificationCode}
                        </h2>
                    </div>
                    <p style="color: #e74c3c;"><strong>Mã này sẽ hết hạn sau 10 phút.</strong></p>
                    <p>Vui lòng nhập mã này vào trang xác thực email để hoàn tất đăng ký.</p>
                    <p>Nếu bạn không thực hiện đăng ký, vui lòng bỏ qua email này.</p>
                    <hr style="border: 1px solid #eee; margin: 20px 0;">
                    <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
                        Trân trọng,<br>Đội ngũ Thư viện tài liệu
                    </p>
                </div>
            `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(`Verification email sent to ${email}. MessageId: ${info.messageId}`);
        return true;
    } catch (error) {
        logger.error(`Error sending verification email to ${email}: ${error.message}`);
        throw new Error("Không thể gửi email xác thực. Vui lòng thử lại sau.");
    }
};

exports.sendResetPasswordEmail = async (email, resetLink) => {
    const mailOptions = {
        from: `"Thư viện tài liệu" <${process.env.EMAIL_USER}>`,
        to: email,
        subject: "Đặt lại mật khẩu",
        html: `
                <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
                <h1 style="color: #2c3e50; text-align: center;">Đặt lại mật khẩu</h1>
                <p>Xin chào,</p>
                <p>Bạn đã yêu cầu đặt lại mật khẩu. Vui lòng nhấn vào liên kết dưới đây để tiếp tục:</p>
                <div style="text-align: center; margin: 20px 0;">
                    <a href="${resetLink}" style="display: inline-block; padding: 10px 20px; background-color: #007bff; color: white; text-decoration: none; border-radius: 5px;">Đặt lại mật khẩu</a>
                </div>
                <p style="color: #e74c3c;"><strong>Liên kết này sẽ hết hạn sau 10 phút.</strong></p>
                <p>Nếu bạn không yêu cầu đặt lại mật khẩu, vui lòng bỏ qua email này.</p>
                <hr style="border: 1px solid #eee; margin: 20px 0;">
                <p style="color: #7f8c8d; font-size: 12px; text-align: center;">
                    Trân trọng,<br>Đội ngũ Thư viện tài liệu<br>
                    <a href="https://www.thuvientainguyen.vn" style="color: #3498db; text-decoration: none;">Website chính thức</a>
                </p>
            </div>
            `,
    };
    try {
        const info = await transporter.sendMail(mailOptions);
        logger.info(
            `Reset password email sent to ${email}. MessageId: ${info.messageId}, Response: ${info.response}`
        );
        return true;
    } catch (error) {
        logger.error(`Error sending reset password email: ${error.message}`);
        throw new Error("Không thể gửi email đặt lại mật khẩu. Vui lòng thử lại sau.");
    }
};
