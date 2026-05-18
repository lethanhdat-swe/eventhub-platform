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

    async sendTicketsEmail(
        email: string,
        fullName: string,
        tickets: {
            seatLabel: string;
            qrImage: string;
        }[]
    ) {
        const attachments = tickets.map((ticket, index) => {
            const base64Data = ticket.qrImage.replace(
                /^data:image\/png;base64,/,
                ""
            );

            return {
                filename: `ticket-${ticket.seatLabel}.png`,
                content: base64Data,
                encoding: "base64",
                cid: `ticket-${index}@eventhub`,
            };
        });

        const ticketHtml = tickets
            .map(
                (ticket, index) => `
            <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:18px;padding:20px;margin-bottom:18px;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:16px;">
                    <div>
                        <div style="font-size:12px;color:#71717a;margin-bottom:4px;">
                            Ticket
                        </div>
                        <div style="font-size:22px;font-weight:700;color:#09090b;">
                            Ghế ${ticket.seatLabel}
                        </div>
                    </div>
                </div>

                <div style="text-align:center;background:#ffffff;border-radius:16px;padding:18px;border:1px solid #e4e4e7;">
                    <img
                        src="cid:ticket-${index}@eventhub"
                        alt="Ticket QR"
                        width="220"
                        style="display:block;margin:0 auto;"
                    />
                </div>
            </div>
        `
            )
            .join("");

        const mailOptions = {
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "Vé sự kiện EventHub của bạn",
            html: `
            <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                    <div style="background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e4e4e7;">
                        <div style="margin-bottom:28px;">
                            <div style="font-size:14px;color:#71717a;margin-bottom:8px;">
                                EventHub
                            </div>
                            <h1 style="margin:0;font-size:28px;line-height:1.3;color:#09090b;">
                                Vé của bạn đã sẵn sàng 🎟️
                            </h1>
                        </div>
        
                        <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                            Chào <strong>${fullName}</strong>,
                        </p>
        
                        <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:#3f3f46;">
                            Thanh toán của bạn đã thành công. Dưới đây là mã QR check-in cho từng ghế.
                            Vui lòng xuất trình mã QR này khi vào sự kiện.
                        </p>
        
                        <div style="margin:24px 0;">
                            ${ticketHtml}
                        </div>
        
                        <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:16px;padding:16px;margin-top:24px;">
                            <p style="margin:0;font-size:14px;line-height:1.6;color:#52525b;">
                                Lưu ý: Mỗi mã QR chỉ dùng cho một ghế. Vui lòng không chia sẻ mã QR cho người khác.
                            </p>
                        </div>
        
                        <p style="font-size:14px;line-height:1.6;color:#71717a;margin:28px 0 0;">
                            Cảm ơn bạn đã sử dụng EventHub.<br/>
                            Hẹn gặp bạn tại sự kiện!
                        </p>
                    </div>
        
                    <p style="text-align:center;font-size:12px;color:#a1a1aa;margin:20px 0 0;">
                        © ${new Date().getFullYear()} EventHub. All rights reserved.
                    </p>
                </div>
            </div>
        `,
            attachments,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Tickets email sent to ${email}`);
        } catch (error) {
            console.error("Error sending tickets email:", error);
        }
    }
}

export default new MailService();
