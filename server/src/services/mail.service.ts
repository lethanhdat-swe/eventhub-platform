import nodemailer from "nodemailer";

class MailService {
    private transporter;

    constructor() {
        this.transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST || "smtp.gmail.com",
            port: Number(process.env.MAIL_PORT) || 587,
            secure: false,
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });
    }

    async sendVerificationEmail(
        email: string,
        fullName: string,
        token: string
    ) {
        const mailOptions = {
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Xác thực tài khoản EventHub",
            html: `
                <h1>Chào ${fullName},</h1>
                <p>Cảm ơn bạn đã đăng ký tài khoản tại EventHub.</p>
                <p>Vui lòng click vào link bên dưới để xác thực tài khoản của bạn:</p>
                <a href="${process.env.FRONTEND_URL}/verify-email?token=${token}">Xác thực ngay</a>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Verification email sent to ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }

    async sendForgotPasswordEmail(
        email: string,
        fullName: string,
        token: string
    ) {
        const mailOptions = {
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Khôi phục mật khẩu EventHub",
            html: `
                <h1>Chào ${fullName},</h1>
                <p>Bạn đã yêu cầu khôi phục mật khẩu tại EventHub.</p>
                <p>Vui lòng click vào link bên dưới để đặt lại mật khẩu của bạn:</p>
                <a href="${process.env.FRONTEND_URL}/reset-password?token=${token}">Đặt lại mật khẩu</a>
                <p>Link này sẽ hết hạn sau 1 giờ.</p>
                <p>Nếu bạn không yêu cầu điều này, vui lòng bỏ qua email này.</p>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Forgot password email sent to ${email}`);
        } catch (error) {
            console.error("Error sending email:", error);
        }
    }
}

export default new MailService();
