import { prisma } from "../utils/prisma";
import { AppError } from "../utils/AppError";
import { getPaginationMetadata } from "../utils/pagination";
import slugify from "slugify";

const artistSelect = {
    id: true,
    name: true,
    slug: true,
    avatarUrl: true,
    description: true,
    createdAt: true,
    updatedAt: true,
};

class ArtistService {
    async create(body: {
        name: string;
        avatarUrl?: string;
        description?: string;
    }) {
        const { name, avatarUrl, description } = body;

        let slug = slugify(name, { lower: true, strict: true });

        // handle duplicate slug
        const existed = await prisma.artist.findUnique({ where: { slug } });
        if (existed) {
            slug = `${slug}-${Date.now()}`;
        }

        const artist = await prisma.artist.create({
            data: {
                name,
                slug,
                avatarUrl,
                description,
            },
            select: artistSelect,
        });

        return artist;
    }

    async list(query: { page: number; limit: number; search?: string }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: any = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        const [artists, total] = await Promise.all([
            prisma.artist.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                select: artistSelect,
            }),
            prisma.artist.count({ where }),
        ]);

        return {
            data: artists,
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const artist = await prisma.artist.findUnique({
            where: { id },
            select: artistSelect,
        });

        if (!artist) {
            throw new AppError("Artist not found", 404);
        }

        return artist;
    }

    async update(
        id: string,
        body: { name?: string; avatarUrl?: string; description?: string }
    ) {
        const existing = await prisma.artist.findUnique({ where: { id } });

        if (!existing) {
            throw new AppError("Artist not found", 404);
        }

        let slug = existing.slug;

        if (body.name) {
            slug = slugify(body.name, { lower: true, strict: true });

            const duplicate = await prisma.artist.findFirst({
                where: {
                    slug,
                    NOT: { id },
                },
            });

            if (duplicate) {
                slug = `${slug}-${Date.now()}`;
            }
        }

        const updated = await prisma.artist.update({
            where: { id },
            data: {
                ...body,
                slug,
            },
            select: artistSelect,
        });

        return updated;
    }

    async delete(ids: string[]) {
        const result = await prisma.artist.deleteMany({
            where: {
                id: { in: ids },
            },
        });

        if (result.count === 0) {
            throw new AppError("No artists found to delete", 404);
        }

        return result;
    }
}

export default ArtistService;
