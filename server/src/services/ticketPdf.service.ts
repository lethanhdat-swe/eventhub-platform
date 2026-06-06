import PDFDocument from "pdfkit";
import QRCode from "qrcode";
import fs from "fs";
import path from "path";

function resolveFontDir(): string {
    const candidates = [
        path.join(__dirname, "../assets/fonts"),
        path.resolve(process.cwd(), "src/assets/fonts"),
    ];

    for (const dir of candidates) {
        if (fs.existsSync(path.join(dir, "Roboto-Regular.ttf"))) {
            return dir;
        }
    }

    return path.resolve(process.cwd(), "src/assets/fonts");
}

const fontDir = resolveFontDir();
const regularFontPath = path.join(fontDir, "Roboto-Regular.ttf");
const boldFontPath = path.join(fontDir, "Roboto-Bold.ttf");

type TicketPdfOrder = {
    id: string;
    customerEmail: string;
    customerPhone: string;
    customerName: string | null;
    totalAmount: number | null;
    status: string;
    paymentMethod: string;
    orderCode: string | null;
    createdAt: Date;
    user: {
        id: string;
        email: string;
        fullName: string;
        phoneNumber: string | null;
    } | null;
    paymentTransactions: {
        id: string;
        amount: number;
        gateway: string | null;
        createdAt: Date;
    }[];
    tickets: {
        id: string;
        qrSecureToken: string;
        isCheckedIn: boolean;
        checkedInAt: Date | null;
        eventSeat: {
            id: string;
            rowLabel: string;
            seatNumber: number;
            event: {
                id: string;
                title: string;
                location: string | null;
                startDate: Date | null;
                endDate: Date | null;
                thumbnailUrl: string | null;
            };
            ticketType: {
                id: string;
                name: string;
                price: number;
                color: string;
            };
        };
    }[];
};

type GeneratedTicketPdf = {
    buffer: Buffer;
    fileName: string;
};

class TicketPdfService {
    private readonly pageX = 42;
    private readonly pageTop = 38;
    private readonly pageWidth = 511;
    private readonly pageBottom = 800;

    private formatMoney(value: number | null | undefined): string {
        return new Intl.NumberFormat("vi-VN", {
            style: "currency",
            currency: "VND",
            maximumFractionDigits: 0,
        }).format(Number(value || 0));
    }

    private formatDateTime(value: Date | string | null | undefined): string {
        if (!value) return "—";

        const date = new Date(value);

        if (Number.isNaN(date.getTime())) return "—";

        return new Intl.DateTimeFormat("vi-VN", {
            day: "2-digit",
            month: "2-digit",
            year: "numeric",
            hour: "2-digit",
            minute: "2-digit",
        }).format(date);
    }

    private getSeatLabel(ticket: TicketPdfOrder["tickets"][number]): string {
        const seat = ticket.eventSeat;

        const label = [seat.rowLabel, seat.seatNumber]
            .filter(
                (value) => value !== null && value !== undefined && value !== ""
            )
            .join("");

        return label || "—";
    }

    private getTicketTypeName(
        ticket: TicketPdfOrder["tickets"][number]
    ): string {
        return ticket.eventSeat.ticketType.name || "—";
    }

    private getMainEvent(order: TicketPdfOrder) {
        return order.tickets[0]?.eventSeat.event ?? null;
    }

    private getPaidTransaction(order: TicketPdfOrder) {
        return order.paymentTransactions[0] ?? null;
    }

    private registerFonts(doc: PDFKit.PDFDocument): void {
        doc.registerFont("Regular", regularFontPath);
        doc.registerFont("Bold", boldFontPath);
        doc.font("Regular");
    }

    private resetFont(doc: PDFKit.PDFDocument): void {
        doc.font("Regular").fillColor("#111827");
    }

    private drawPill(
        doc: PDFKit.PDFDocument,
        text: string,
        x: number,
        y: number,
        width: number,
        options?: {
            backgroundColor?: string;
            textColor?: string;
        }
    ): void {
        const backgroundColor = options?.backgroundColor ?? "#DCFCE7";
        const textColor = options?.textColor ?? "#166534";

        doc.roundedRect(x, y, width, 22, 11).fill(backgroundColor);

        doc.font("Bold")
            .fontSize(8)
            .fillColor(textColor)
            .text(text, x, y + 6, {
                width,
                align: "center",
            });

        this.resetFont(doc);
    }

    private drawSectionLabel(
        doc: PDFKit.PDFDocument,
        text: string,
        x: number,
        y: number
    ): void {
        doc.font("Bold").fontSize(8).fillColor("#7C3AED").text(text, x, y, {
            characterSpacing: 0.7,
        });

        this.resetFont(doc);
    }

    private drawInfoItem(
        doc: PDFKit.PDFDocument,
        label: string,
        value: string | number | null | undefined,
        x: number,
        y: number,
        width: number,
        options?: {
            valueSize?: number;
            valueColor?: string;
        }
    ): void {
        doc.font("Regular").fontSize(8).fillColor("#6B7280").text(label, x, y, {
            width,
        });

        doc.font("Bold")
            .fontSize(options?.valueSize ?? 9)
            .fillColor(options?.valueColor ?? "#111827")
            .text(`${value ?? "—"}`, x, y + 12, {
                width,
                lineGap: 1,
            });

        this.resetFont(doc);
    }

    private drawHeader(doc: PDFKit.PDFDocument, order: TicketPdfOrder): number {
        const headerY = this.pageTop;
        const headerHeight = 78;

        doc.roundedRect(
            this.pageX,
            headerY,
            this.pageWidth,
            headerHeight,
            18
        ).fillAndStroke("#111827", "#111827");

        doc.font("Bold")
            .fontSize(21)
            .fillColor("#FFFFFF")
            .text("Beetic", this.pageX + 20, headerY + 17);

        doc.font("Regular")
            .fontSize(9)
            .fillColor("#CBD5E1")
            .text("VÉ THAM DỰ SỰ KIỆN", this.pageX + 20, headerY + 46, {
                characterSpacing: 0.6,
            });

        this.drawPill(
            doc,
            "ĐÃ THANH TOÁN",
            this.pageX + this.pageWidth - 126,
            headerY + 17,
            100,
            {
                backgroundColor: "#DCFCE7",
                textColor: "#166534",
            }
        );

        doc.font("Regular")
            .fontSize(8)
            .fillColor("#CBD5E1")
            .text(
                "Mã đơn hàng",
                this.pageX + this.pageWidth - 210,
                headerY + 48,
                {
                    width: 184,
                    align: "right",
                }
            );

        doc.font("Bold")
            .fontSize(9)
            .fillColor("#FFFFFF")
            .text(
                order.orderCode || order.id,
                this.pageX + this.pageWidth - 250,
                headerY + 60,
                {
                    width: 224,
                    align: "right",
                }
            );

        this.resetFont(doc);

        return headerY + headerHeight + 12;
    }

    private drawEventSummary(
        doc: PDFKit.PDFDocument,
        order: TicketPdfOrder,
        y: number
    ): number {
        const event = this.getMainEvent(order);
        const cardHeight = 96;

        doc.roundedRect(
            this.pageX,
            y,
            this.pageWidth,
            cardHeight,
            16
        ).fillAndStroke("#FFFFFF", "#E5E7EB");

        this.drawSectionLabel(doc, "SỰ KIỆN", this.pageX + 18, y + 14);

        doc.font("Bold")
            .fontSize(17)
            .fillColor("#111827")
            .text(event?.title || "Sự kiện", this.pageX + 18, y + 30, {
                width: this.pageWidth - 36,
                lineGap: 1,
            });

        const infoY = y + 63;
        const colGap = 16;
        const colWidth = (this.pageWidth - 36 - colGap) / 2;

        this.drawInfoItem(
            doc,
            "Thời gian",
            this.formatDateTime(event?.startDate),
            this.pageX + 18,
            infoY,
            colWidth
        );

        this.drawInfoItem(
            doc,
            "Địa điểm",
            event?.location || "Chưa cập nhật",
            this.pageX + 18 + colWidth + colGap,
            infoY,
            colWidth
        );

        return y + cardHeight + 10;
    }

    private drawInfoCard(
        doc: PDFKit.PDFDocument,
        title: string,
        items: {
            label: string;
            value: string | number | null | undefined;
        }[],
        x: number,
        y: number,
        width: number
    ): number {
        const cardHeight = 126;

        doc.roundedRect(x, y, width, cardHeight, 14).fillAndStroke(
            "#F9FAFB",
            "#E5E7EB"
        );

        doc.font("Bold")
            .fontSize(11)
            .fillColor("#111827")
            .text(title, x + 15, y + 13);

        let itemY = y + 36;

        for (const item of items) {
            this.drawInfoItem(
                doc,
                item.label,
                item.value,
                x + 15,
                itemY,
                width - 30
            );
            itemY += 28;
        }

        return y + cardHeight;
    }

    private drawBuyerAndPayment(
        doc: PDFKit.PDFDocument,
        order: TicketPdfOrder,
        y: number
    ): number {
        const paidTransaction = this.getPaidTransaction(order);
        const gap = 12;
        const cardWidth = (this.pageWidth - gap) / 2;

        const buyerBottom = this.drawInfoCard(
            doc,
            "Người mua",
            [
                {
                    label: "Họ tên",
                    value: order.customerName || order.user?.fullName || "—",
                },
                {
                    label: "Email",
                    value: order.customerEmail || order.user?.email || "—",
                },
                {
                    label: "Số điện thoại",
                    value:
                        order.customerPhone || order.user?.phoneNumber || "—",
                },
            ],
            this.pageX,
            y,
            cardWidth
        );

        const paymentBottom = this.drawInfoCard(
            doc,
            "Thanh toán",
            [
                {
                    label: "Tổng tiền",
                    value: this.formatMoney(order.totalAmount),
                },
                {
                    label: "Phương thức",
                    value: order.paymentMethod || "—",
                },
                {
                    label: "Thanh toán lúc",
                    value: this.formatDateTime(paidTransaction?.createdAt),
                },
            ],
            this.pageX + cardWidth + gap,
            y,
            cardWidth
        );

        return Math.max(buyerBottom, paymentBottom) + 10;
    }

    private drawTicketSectionTitle(doc: PDFKit.PDFDocument, y: number): number {
        doc.font("Bold")
            .fontSize(12)
            .fillColor("#111827")
            .text("Danh sách vé", this.pageX, y);

        this.resetFont(doc);

        return y + 20;
    }

    private async drawTicketCard(
        doc: PDFKit.PDFDocument,
        ticket: TicketPdfOrder["tickets"][number],
        index: number,
        x: number,
        y: number
    ): Promise<number> {
        const cardWidth = this.pageWidth;
        const cardHeight = 118;
        const qrSize = 78;

        doc.roundedRect(x, y, cardWidth, cardHeight, 14).fillAndStroke(
            "#F9FAFB",
            "#E5E7EB"
        );

        doc.font("Bold")
            .fontSize(13)
            .fillColor("#111827")
            .text(`Vé ${index + 1}`, x + 16, y + 14);

        doc.font("Regular")
            .fontSize(8)
            .fillColor("#6B7280")
            .text("Mã vé", x + 16, y + 36);

        doc.font("Bold")
            .fontSize(8.5)
            .fillColor("#111827")
            .text(ticket.id, x + 16, y + 48, {
                width: 300,
            });

        this.drawInfoItem(
            doc,
            "Loại vé",
            this.getTicketTypeName(ticket),
            x + 16,
            y + 76,
            120
        );

        this.drawInfoItem(
            doc,
            "Ghế",
            this.getSeatLabel(ticket),
            x + 150,
            y + 76,
            80
        );

        this.drawInfoItem(
            doc,
            "Trạng thái",
            ticket.isCheckedIn ? "Đã sử dụng" : "Vé hợp lệ",
            x + 250,
            y + 76,
            110,
            {
                valueColor: ticket.isCheckedIn ? "#DC2626" : "#059669",
            }
        );

        if (ticket.qrSecureToken) {
            const qrImage = await QRCode.toDataURL(ticket.qrSecureToken, {
                width: 220,
                margin: 1,
            });

            const qrBoxX = x + 396;
            const qrBoxY = y + 13;

            doc.roundedRect(
                qrBoxX - 6,
                qrBoxY - 6,
                qrSize + 12,
                qrSize + 12,
                10
            ).fill("#FFFFFF");

            doc.image(qrImage, qrBoxX, qrBoxY, {
                width: qrSize,
                height: qrSize,
            });

            doc.font("Regular")
                .fontSize(7)
                .fillColor("#6B7280")
                .text("Quét mã để check-in", x + 372, y + 95, {
                    width: 130,
                    align: "center",
                });
        } else {
            doc.font("Bold")
                .fontSize(9)
                .fillColor("#DC2626")
                .text("Vé chưa có mã QR", x + 370, y + 48, {
                    width: 130,
                    align: "center",
                });
        }

        this.resetFont(doc);

        doc.y = y + cardHeight;
        return y + cardHeight + 8;
    }

    private async drawTickets(
        doc: PDFKit.PDFDocument,
        order: TicketPdfOrder,
        y: number
    ): Promise<number> {
        y = this.drawTicketSectionTitle(doc, y);

        for (let index = 0; index < order.tickets.length; index += 1) {
            const ticketHeight = 118;
            const nextBlockHeight = ticketHeight + 8;

            if (y + nextBlockHeight > this.pageBottom) {
                doc.addPage();
                y = this.pageTop;
                y = this.drawTicketSectionTitle(doc, y);
            }

            y = await this.drawTicketCard(
                doc,
                order.tickets[index],
                index,
                this.pageX,
                y
            );
        }

        doc.y = y;
        return y;
    }

    private drawNotes(doc: PDFKit.PDFDocument, y: number): number {
        const notes = [
            "Vui lòng xuất trình mã QR khi check-in.",
            "Mỗi vé chỉ có giá trị cho một lượt check-in.",
            "Không chia sẻ mã QR công khai.",
            "Beetic không chịu trách nhiệm nếu vé bị người khác sử dụng do bạn tự chia sẻ.",
            "Vui lòng đến trước giờ diễn ra sự kiện.",
        ];

        const cardHeight = 96;

        if (y + cardHeight > this.pageBottom) {
            doc.addPage();
            y = this.pageTop;
        }

        doc.roundedRect(
            this.pageX,
            y,
            this.pageWidth,
            cardHeight,
            14
        ).fillAndStroke("#FFFBEB", "#FDE68A");

        doc.font("Bold")
            .fontSize(10.5)
            .fillColor("#92400E")
            .text("Lưu ý sử dụng vé", this.pageX + 16, y + 12);

        let noteY = y + 32;

        for (const note of notes) {
            doc.font("Regular")
                .fontSize(8)
                .fillColor("#78350F")
                .text(`• ${note}`, this.pageX + 18, noteY, {
                    width: this.pageWidth - 36,
                });

            noteY += 10;
        }

        this.resetFont(doc);

        doc.y = y + cardHeight;
        return y + cardHeight;
    }

    private buildPdfBuffer(order: TicketPdfOrder): Promise<Buffer> {
        return new Promise((resolve, reject) => {
            const doc = new PDFDocument({
                size: "A4",
                margin: 42,
                info: {
                    Title: `Beetic Ticket - ${order.orderCode || order.id}`,
                    Author: "Beetic",
                },
            });

            this.registerFonts(doc);

            const chunks: Buffer[] = [];

            doc.on("data", (chunk: Buffer) => {
                chunks.push(chunk);
            });

            doc.on("end", () => {
                resolve(Buffer.concat(chunks));
            });

            doc.on("error", reject);

            void this.writePdfContent(doc, order)
                .then(() => {
                    doc.end();
                })
                .catch((error: unknown) => {
                    reject(error);
                });
        });
    }

    private async writePdfContent(
        doc: PDFKit.PDFDocument,
        order: TicketPdfOrder
    ): Promise<void> {
        let currentY = this.drawHeader(doc, order);

        currentY = this.drawEventSummary(doc, order, currentY);

        currentY = this.drawBuyerAndPayment(doc, order, currentY);

        currentY = await this.drawTickets(doc, order, currentY);

        this.drawNotes(doc, currentY + 8);
    }

    async generateOrderTicketPdf(
        order: TicketPdfOrder
    ): Promise<GeneratedTicketPdf> {
        const buffer = await this.buildPdfBuffer(order);

        return {
            buffer,
            fileName: `eventhub-ticket-${order.orderCode || order.id}.pdf`,
        };
    }
}

export default new TicketPdfService();
