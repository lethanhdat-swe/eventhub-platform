import QRCode from "qrcode";

class QrService {
    async generateTicketQr(qrSecureToken: string) {
        const payload = `${process.env.CLIENT_URL}/checkin?token=${qrSecureToken}`;

        return QRCode.toDataURL(payload, {
            errorCorrectionLevel: "H",
            margin: 2,
            width: 300,
        });
    }
}

export default new QrService();
