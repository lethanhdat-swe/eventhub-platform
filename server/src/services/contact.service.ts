import { NotificationType } from "@prisma/client";
import { prisma } from "../utils/prisma";
import notificationService from "./notification.service";

class ContactService {
    create = async (data: any) => {
        await notificationService.createNotification({
            type: NotificationType.CONTACT_CREATED,
            title: "Liên hệ mới",
            message: `${data.fullName} vừa gửi một tin nhắn liên hệ.`,
        });

        return await prisma.contact.create({ data });
    };

    list = async (page: number, limit: number) => {
        const skip = (page - 1) * limit;

        const [items, totalItems] = await Promise.all([
            prisma.contact.findMany({
                skip,
                take: limit,
                orderBy: { createdAt: "desc" },
            }),
            prisma.contact.count(),
        ]);

        return {
            items,
            meta: {
                totalItems,
                itemCount: items.length.toString(), // Số lượng item thực tế của trang này
                itemsPerPage: limit.toString(), // Số lượng item tối đa mỗi trang
                totalPages: Math.ceil(totalItems / limit),
                currentPage: page.toString(), // Trang hiện tại
            },
        };
    };

    delete = async (id: string) => {
        return await prisma.contact.delete({ where: { id } });
    };
}

export default new ContactService();
