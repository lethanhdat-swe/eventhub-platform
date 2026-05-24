import QRCode from "qrcode";

class QrService {
    async generateTicketQr(qrSecureToken: string) {
        const payload = qrSecureToken;

        return QRCode.toDataURL(payload, {
            errorCorrectionLevel: "H",
            margin: 2,
            width: 300,
        });
    }
}

export default new QrService();
