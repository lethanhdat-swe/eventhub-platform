import mailService from "../services/mail.service";

type Payload = {
    email: string;
    fullName: string;
    orderCode: string;
    refundAmount: number;
    refundPercent: number;
    result: "COMPLETED" | "REJECTED";
};

export async function sendRefundResultEmailJob(payload: Payload) {
    await mailService.sendRefundResultEmail(payload);
}
