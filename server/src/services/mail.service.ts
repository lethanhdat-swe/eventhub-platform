import nodemailer from "nodemailer";

type SendEventReminderEmailParams = {
    email: string;
    fullName: string;
    event: {
        title: string;
        location: string | null;
        startDate: Date | null;
    };
};

type SendRefundRequestReceivedEmailParams = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
};

type RefundResultEmailPayload = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    result: "COMPLETED" | "REJECTED";
};

function formatVnd(amount: number) {
    return new Intl.NumberFormat("vi-VN", {
        style: "currency",
        currency: "VND",
        maximumFractionDigits: 0,
    }).format(Number(amount || 0));
}

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
        order: {
            orderCode: string;
            totalAmount: number;
            finalAmount?: number;
            paymentMethod: string;
            paidAt?: Date | string | null;
            createdAt: Date | string;
            eventTitle?: string | null;
            eventStartDate?: Date | string | null;
            eventLocation?: string | null;
        },
        tickets: {
            seatLabel: string;
            qrImage: string;
        }[]
    ) {
        const formatCurrency = (amount: number) => {
            return new Intl.NumberFormat("vi-VN", {
                style: "currency",
                currency: "VND",
            }).format(amount);
        };

        const formatDateTime = (date?: Date | string | null) => {
            if (!date) return "Chưa cập nhật";

            return new Intl.DateTimeFormat("vi-VN", {
                dateStyle: "medium",
                timeStyle: "short",
            }).format(new Date(date));
        };

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
            subject: `Vé sự kiện EventHub - Đơn hàng ${order.orderCode}`,
            html: `
                <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
                    <div style="max-width:680px;margin:0 auto;padding:32px 16px;">
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
                                Thanh toán của bạn đã thành công. Dưới đây là thông tin đơn hàng và mã QR check-in cho từng ghế.
                                Vui lòng xuất trình mã QR này khi vào sự kiện.
                            </p>
    
                            <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:18px;padding:20px;margin:24px 0;">
                                <h2 style="font-size:18px;margin:0 0 16px;color:#09090b;">
                                    Thông tin đơn hàng
                                </h2>
    
                                <table style="width:100%;border-collapse:collapse;font-size:14px;color:#3f3f46;">
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Mã đơn hàng</td>
                                        <td style="padding:8px 0;text-align:right;font-weight:700;color:#09090b;">
                                            ${order.orderCode}
                                        </td>
                                    </tr>
    
                                    ${
                                        order.eventTitle
                                            ? `
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Sự kiện</td>
                                        <td style="padding:8px 0;text-align:right;font-weight:600;color:#09090b;">
                                            ${order.eventTitle}
                                        </td>
                                    </tr>
                                    `
                                            : ""
                                    }
    
                                    ${
                                        order.eventStartDate
                                            ? `
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Thời gian sự kiện</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${formatDateTime(order.eventStartDate)}
                                        </td>
                                    </tr>
                                    `
                                            : ""
                                    }
    
                                    ${
                                        order.eventLocation
                                            ? `
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Địa điểm</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${order.eventLocation}
                                        </td>
                                    </tr>
                                    `
                                            : ""
                                    }
    
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Số lượng vé</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${tickets.length}
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Phương thức thanh toán</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${order.paymentMethod}
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Ngày đặt</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${formatDateTime(order.createdAt)}
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Ngày thanh toán</td>
                                        <td style="padding:8px 0;text-align:right;">
                                            ${formatDateTime(order.paidAt)}
                                        </td>
                                    </tr>
    
                                    <tr>
                                        <td style="padding:8px 0;color:#71717a;">Tổng tiền</td>
                                        <td style="padding:8px 0;text-align:right;font-weight:700;color:#09090b;">
                                            ${formatCurrency(order.finalAmount ?? order.totalAmount)}
                                        </td>
                                    </tr>
                                </table>
                            </div>
    
                            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:18px;padding:18px;margin:24px 0;">
                                <h2 style="font-size:17px;margin:0 0 10px;color:#9a3412;">
                                    Chính sách hoàn tiền
                                </h2>
    
                                <p style="margin:0 0 10px;font-size:14px;line-height:1.6;color:#7c2d12;">
                                    Nếu bạn muốn yêu cầu hoàn tiền, vui lòng sử dụng mã đơn hàng:
                                </p>
    
                                <div style="background:#ffffff;border:1px dashed #fb923c;border-radius:12px;padding:12px;text-align:center;font-size:20px;font-weight:700;color:#9a3412;letter-spacing:0.5px;">
                                    ${order.orderCode}
                                </div>
    
                                <p style="margin:12px 0 0;font-size:13px;line-height:1.6;color:#7c2d12;">
                                    Hoàn tiền 100% nếu yêu cầu hủy được gửi trước 3 ngày so với thời gian diễn ra sự kiện.
                                    Hoàn tiền 50% nếu yêu cầu hủy được gửi trong vòng 3 ngày trước sự kiện.
                                    Sự kiện đã diễn ra sẽ không được hỗ trợ hoàn tiền.
                                </p>
                            </div>
    
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
            throw error;
        }
    }

    async sendEventReminderEmail({
        email,
        fullName,
        event,
    }: SendEventReminderEmailParams) {
        const eventDate = event.startDate
            ? event.startDate.toLocaleString("vi-VN", {
                  dateStyle: "full",
                  timeStyle: "short",
                  timeZone: "Asia/Ho_Chi_Minh",
              })
            : "sắp diễn ra";

        const mailOptions = {
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: `Nhắc nhở sự kiện: ${event.title}`,
            html: `
            <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
                <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                    <div style="background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e4e4e7;">
                        <div style="margin-bottom:28px;">
                            <div style="font-size:14px;color:#71717a;margin-bottom:8px;">
                                EventHub
                            </div>

                            <h1 style="margin:0;font-size:28px;line-height:1.3;color:#09090b;">
                                Sự kiện của bạn sắp diễn ra
                            </h1>
                        </div>

                        <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                            Chào <strong>${fullName}</strong>,
                        </p>

                        <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:#3f3f46;">
                            EventHub nhắc bạn rằng sự kiện <strong>${event.title}</strong>
                            mà bạn đã đặt vé sẽ sắp diễn ra.
                        </p>

                        <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:16px;padding:18px;margin:24px 0;">
                            <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#27272a;">
                                <strong>Thời gian:</strong> ${eventDate}
                            </p>

                            ${
                                event.location
                                    ? `
                                        <p style="margin:0;font-size:15px;line-height:1.6;color:#27272a;">
                                            <strong>Địa điểm:</strong> ${event.location}
                                        </p>
                                    `
                                    : ""
                            }
                        </div>

                        <p style="font-size:15px;line-height:1.7;margin:0 0 16px;color:#3f3f46;">
                            Bạn vui lòng chuẩn bị mã QR vé và đến đúng giờ để quá trình check-in diễn ra thuận tiện.
                        </p>

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
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Event reminder email sent to ${email}`);
        } catch (error) {
            console.error("Error sending event reminder email:", error);
        }
    }

    async sendRefundRequestReceivedEmail({
        email,
        fullName,
        orderCode,
        refundAmount,
        refundPercent,
        bankName,
        bankAccountNumber,
        bankAccountHolder,
    }: SendRefundRequestReceivedEmailParams) {
        const mailOptions = {
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: "EventHub đã nhận yêu cầu hoàn vé của bạn",
            html: `
                <div style="margin:0;padding:0;background:#f4f4f5;font-family:Arial,sans-serif;color:#18181b;">
                    <div style="max-width:640px;margin:0 auto;padding:32px 16px;">
                        <div style="background:#ffffff;border-radius:20px;padding:32px;border:1px solid #e4e4e7;">
                            <div style="margin-bottom:28px;">
                                <div style="font-size:14px;color:#71717a;margin-bottom:8px;">
                                    EventHub
                                </div>
    
                                <h1 style="margin:0;font-size:28px;line-height:1.3;color:#09090b;">
                                    Yêu cầu hoàn vé đã được ghi nhận
                                </h1>
                            </div>
    
                            <p style="font-size:16px;line-height:1.7;margin:0 0 16px;">
                                Chào <strong>${fullName}</strong>,
                            </p>
    
                            <p style="font-size:15px;line-height:1.7;margin:0 0 24px;color:#3f3f46;">
                                EventHub đã nhận được yêu cầu hoàn vé cho đơn hàng
                                <strong>${orderCode}</strong>. Yêu cầu của bạn đang được chuyển đến quản trị viên để kiểm tra và xử lý.
                            </p>
    
                            <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:16px;padding:18px;margin:24px 0;">
                                <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Mã đơn hàng:</strong> ${orderCode}
                                </p>
    
                                <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Tỷ lệ hoàn dự kiến:</strong> ${refundPercent}%
                                </p>
    
                                <p style="margin:0;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Số tiền hoàn dự kiến:</strong> ${formatVnd(refundAmount)}
                                </p>
                            </div>
    
                            <div style="background:#fafafa;border:1px solid #e4e4e7;border-radius:16px;padding:18px;margin:24px 0;">
                                <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Ngân hàng:</strong> ${bankName}
                                </p>
    
                                <p style="margin:0 0 10px;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Số tài khoản:</strong> ${bankAccountNumber}
                                </p>
    
                                <p style="margin:0;font-size:15px;line-height:1.6;color:#27272a;">
                                    <strong>Chủ tài khoản:</strong> ${bankAccountHolder}
                                </p>
                            </div>
    
                            <div style="background:#fff7ed;border:1px solid #fed7aa;border-radius:16px;padding:16px;margin-top:24px;">
                                <p style="margin:0;font-size:14px;line-height:1.6;color:#9a3412;">
                                    Lưu ý: Đây là email xác nhận hệ thống đã ghi nhận yêu cầu hoàn vé.
                                    Quản trị viên sẽ kiểm tra thông tin và chuyển khoản thủ công trong thời gian sớm nhất.
                                </p>
                            </div>
    
                            <p style="font-size:14px;line-height:1.6;color:#71717a;margin:28px 0 0;">
                                Cảm ơn bạn đã sử dụng EventHub.<br/>
                                EventHub sẽ cố gắng xử lý yêu cầu của bạn sớm nhất có thể.
                            </p>
                        </div>
    
                        <p style="text-align:center;font-size:12px;color:#a1a1aa;margin:20px 0 0;">
                            © ${new Date().getFullYear()} EventHub. All rights reserved.
                        </p>
                    </div>
                </div>
            `,
        };

        try {
            await this.transporter.sendMail(mailOptions);
            console.log(`Refund request received email sent to ${email}`);
        } catch (error) {
            console.error(
                "Error sending refund request received email:",
                error
            );
        }
    }

    async sendRefundResultEmail({
        email,
        fullName,
        orderCode,
        refundAmount,
        refundPercent,
        result,
    }: RefundResultEmailPayload) {
        const isCompleted = result === "COMPLETED";

        await this.transporter.sendMail({
            from: `"EventHub" <${process.env.MAIL_USER}>`,
            to: email,
            subject: isCompleted
                ? "EventHub đã hoàn tiền vé cho bạn"
                : "EventHub đã từ chối yêu cầu hoàn vé",
            html: `
                <div style="font-family:Arial,sans-serif;background:#f4f4f5;padding:24px;color:#18181b;">
                    <div style="max-width:640px;margin:0 auto;background:#ffffff;border-radius:16px;padding:28px;border:1px solid #e4e4e7;">
                        <h2 style="margin:0 0 16px;color:#09090b;">
                            ${
                                isCompleted
                                    ? "Yêu cầu hoàn vé đã được xử lý"
                                    : "Yêu cầu hoàn vé chưa được chấp nhận"
                            }
                        </h2>
    
                        <p>Chào <strong>${fullName}</strong>,</p>
    
                        <p>
                            ${
                                isCompleted
                                    ? `Yêu cầu hoàn vé cho đơn hàng <strong>${orderCode}</strong> đã được quản trị viên xác nhận hoàn tiền.`
                                    : `Yêu cầu hoàn vé cho đơn hàng <strong>${orderCode}</strong> đã được quản trị viên kiểm tra nhưng chưa thể chấp nhận.`
                            }
                        </p>
    
                        <div style="background:${
                            isCompleted ? "#ecfdf5" : "#fef2f2"
                        };border:1px solid ${
                            isCompleted ? "#a7f3d0" : "#fecaca"
                        };border-radius:12px;padding:16px;margin:20px 0;">
                            <p><strong>Tỷ lệ hoàn:</strong> ${refundPercent}%</p>
                            <p><strong>Số tiền hoàn:</strong> ${formatVnd(refundAmount)}</p>
                        </div>
    
                        <p style="color:#71717a;font-size:14px;line-height:1.6;">
                            ${
                                isCompleted
                                    ? "Tiền hoàn sẽ được chuyển theo thông tin ngân hàng bạn đã cung cấp. Nếu bạn chưa nhận được tiền, vui lòng liên hệ bộ phận hỗ trợ EventHub."
                                    : "Đơn hàng của bạn sẽ được giữ nguyên trạng thái vé hợp lệ. Nếu cần hỗ trợ thêm, vui lòng liên hệ EventHub."
                            }
                        </p>
    
                        <p>Cảm ơn bạn đã sử dụng EventHub.</p>
                    </div>
                </div>
            `,
        });
    }
}

export default new MailService();
