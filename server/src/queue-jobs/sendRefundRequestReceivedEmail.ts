import mailService from "../services/mail.service";

type Payload = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    bankName: string;
    bankAccountNumber: string;
    bankAccountHolder: string;
};

export async function sendRefundRequestReceivedEmailJob(payload: Payload) {
    await mailService.sendRefundRequestReceivedEmail(payload);
}
