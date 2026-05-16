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

const artistSelectWithCount = {
    ...artistSelect,
    _count: {
        select: { events: true },
    },
};

function mapArtistRow<
    T extends { _count?: { events: number } }
>(row: T) {
    const { _count, ...rest } = row;
    return {
        ...rest,
        eventCount: _count?.events ?? 0,
    };
}

class ArtistService {
    async create(body: {
        name: string;
        slug?: string;
        avatarUrl?: string;
        description?: string;
    }) {
        const { name, avatarUrl, description } = body;

        let slug = body.slug
            ? slugify(body.slug.trim(), { lower: true, strict: true })
            : slugify(name, { lower: true, strict: true });

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
            select: artistSelectWithCount,
        });

        return mapArtistRow(artist);
    }

    async list(query: { page: number; limit: number; search?: string }) {
        const { page = 1, limit = 10, search } = query;
        const skip = (page - 1) * limit;

        const where: Record<string, unknown> = {};

        if (search) {
            where.OR = [
                { name: { contains: search } },
                { slug: { contains: search } },
            ];
        }

        const [rows, total] = await Promise.all([
            prisma.artist.findMany({
                where,
                skip,
                take: Number(limit),
                orderBy: { createdAt: "desc" },
                select: artistSelectWithCount,
            }),
            prisma.artist.count({ where }),
        ]);

        return {
            data: rows.map(mapArtistRow),
            meta: getPaginationMetadata(total, page, limit),
        };
    }

    async getDetail(id: string) {
        const artist = await prisma.artist.findUnique({
            where: { id },
            select: artistSelectWithCount,
        });

        if (!artist) {
            throw new AppError("Artist not found", 404);
        }

        return mapArtistRow(artist);
    }

    async update(
        id: string,
        body: {
            name?: string;
            slug?: string;
            avatarUrl?: string | null;
            description?: string;
        }
    ) {
        const existing = await prisma.artist.findUnique({ where: { id } });

        if (!existing) {
            throw new AppError("Artist not found", 404);
        }

        let slug = existing.slug;

        const trimmedSlug = body.slug?.trim();
        if (trimmedSlug) {
            slug = slugify(trimmedSlug, { lower: true, strict: true });
        } else if (body.name !== undefined) {
            slug = slugify(body.name, { lower: true, strict: true });
        }

        if (slug !== existing.slug) {
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

        const data: {
            name?: string;
            slug: string;
            avatarUrl?: string | null;
            description?: string | null;
        } = { slug };

        if (body.name !== undefined) data.name = body.name;
        if (body.avatarUrl !== undefined) {
            data.avatarUrl = body.avatarUrl;
        }
        if (body.description !== undefined) data.description = body.description;

        const updated = await prisma.artist.update({
            where: { id },
            data,
            select: artistSelectWithCount,
        });

        return mapArtistRow(updated);
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
