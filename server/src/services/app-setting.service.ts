import { AppError } from "../utils/AppError";
import { prisma } from "../utils/prisma";

class AppSettingService {
    async getSiteSetting() {
        const setting = await prisma.siteSetting.findFirst();
        return setting;
    }

    async createSiteSetting(data: {
        websiteName?: string | null;
        logoUrl?: string | null;
        address?: string | null;
        hotline?: string | null;
        supportEmail?: string | null;
        workingHours?: string | null;
        mapUrl?: string | null;
    }) {
        const existing = await prisma.siteSetting.findFirst();
        if (existing) {
            throw new AppError(
                "Site setting already exists. Use PUT to update it.",
                409
            );
        }
        return prisma.siteSetting.create({
            data,
        });
    }

    async upsertSiteSetting(data: {
        websiteName?: string | null;
        logoUrl?: string | null;
        address?: string | null;
        hotline?: string | null;
        supportEmail?: string | null;
        workingHours?: string | null;
        mapUrl?: string | null;
    }) {
        const existing = await prisma.siteSetting.findFirst();
        if (existing) {
            return prisma.siteSetting.update({
                where: { id: existing.id },
                data,
            });
        }
        return prisma.siteSetting.create({
            data,
        });
    }

    async deleteSiteSetting() {
        const existing = await prisma.siteSetting.findFirst();
        if (!existing) {
            throw new AppError("Site setting not found.", 404);
        }
        await prisma.siteSetting.deleteMany();
        return true;
    }

    async createBanners(imageUrls: string[]) {
        const data = imageUrls.map((url) => ({ imageUrl: url }));
        return prisma.banner.createMany({
            data,
        });
    }

    async getBanners() {
        return prisma.banner.findMany({
            orderBy: {
                createdAt: "desc",
            },
        });
    }

    async updateBanner(id: string, data: { imageUrl: string }) {
        const banner = await prisma.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new AppError("Banner not found.", 404);
        }
        return prisma.banner.update({
            where: { id },
            data,
        });
    }

    async deleteBanner(id: string) {
        const banner = await prisma.banner.findUnique({
            where: { id },
        });
        if (!banner) {
            throw new AppError("Banner not found.", 404);
        }
        await prisma.banner.delete({
            where: { id },
        });
        return true;
    }
}

export default new AppSettingService();
