import { prisma } from "../src/utils/prisma";

async function main() {
    // 1. Tạo các hạng vé mẫu
    const vipType = await prisma.ticketType.upsert({
        where: { id: "vip-id" },
        update: {},
        create: { name: "VIP", price: 500000 },
    });

    const stdType = await prisma.ticketType.upsert({
        where: { id: "std-id" },
        update: {},
        create: { name: "Standard", price: 200000 },
    });

    // 2. Tạo sơ đồ ghế (Ví dụ rạp có 5 hàng A, B, C, D, E - mỗi hàng 10 ghế)
    const rows = ["A", "B", "C", "D", "E"];
    const seatsData = [];

    for (const row of rows) {
        for (let i = 1; i <= 10; i++) {
            seatsData.push({
                rowLabel: row,
                seatNumber: i,
                // Hàng A và B mặc định là VIP, còn lại là Standard
                defaultTicketTypeId:
                    row === "A" || row === "B" ? vipType.id : stdType.id,
            });
        }
    }

    // Dùng createMany để insert nhanh (MySQL hỗ trợ tốt)
    await prisma.seat.createMany({
        data: seatsData,
    });

    console.log("Seeding thành công!");
}

main()
    .catch((e) => console.error(e))
    .finally(async () => await prisma.$disconnect());
