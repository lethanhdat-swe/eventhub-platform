import { Request, Response } from "express";
import blogService from "../services/blog.service";

class BlogController {
    async getAll(req: Request, res: Response) {
        const result = await blogService.getBlogs(req.query as any);
        res.success({
            message: "Blogs retrieved successfully",
            data: result,
        });
    }

    async getOne(req: Request, res: Response) {
        const blog = await blogService.getBlogById(req.params.id as string);
        res.success({
            message: "Blog retrieved successfully",
            data: blog,
        });
    }

    async getByCategoryId(req: Request, res: Response) {
        const { page, limit, search } = req.query as any;

        const result = await blogService.getBlogsByCategoryId(
            req.params.categoryId as string,
            page,
            limit,
            search
        );

        res.success({
            message: "Blogs by category retrieved successfully",
            data: result,
        });
    }

    async getBySlug(req: Request, res: Response) {
        const blog = await blogService.getBlogBySlug(req.params.slug as string);

        res.success({
            message: "Blog retrieved successfully",
            data: blog,
        });
    }

    async create(req: Request, res: Response) {
        const authorId = req.user?.id as string;
        const blog = await blogService.createBlog(req.body, authorId);
        res.success({
            message: "Blog created successfully",
            data: blog,
            status: 201,
        });
    }

    async update(req: Request, res: Response) {
        const blog = await blogService.updateBlog(
            req.params.id as string,
            req.body
        );
        res.success({
            message: "Blog updated successfully",
            data: blog,
        });
    }

    async delete(req: Request, res: Response) {
        const { ids } = req.body;
        await blogService.deleteBlogs(ids);
        res.success({
            message: "Blogs deleted successfully",
        });
    }
}

export default new BlogController();
