import { Request, Response } from "express";
import blogCategoryService from "../services/blog-category.service";

class BlogCategoryController {
    async create(req: Request, res: Response) {
        const category = await blogCategoryService.createCategory(req.body);
        res.success({
            message: "Category created successfully",
            data: category,
            status: 201,
        });
    }

    async getAll(req: Request, res: Response) {
        const result = await blogCategoryService.getCategories(req.query as any);
        res.success({
            message: "Categories retrieved successfully",
            data: result,
        });
    }

    async getOne(req: Request, res: Response) {
        const category = await blogCategoryService.getCategoryById(
            req.params.id as string
        );
        res.success({
            message: "Category retrieved successfully",
            data: category,
        });
    }

    async update(req: Request, res: Response) {
        const category = await blogCategoryService.updateCategory(
            req.params.id as string,
            req.body
        );
        res.success({
            message: "Category updated successfully",
            data: category,
        });
    }

    async delete(req: Request, res: Response) {
        const { ids } = req.body;
        await blogCategoryService.deleteCategories(ids);

        res.success({
            message: "Categories deleted successfully",
        });
    }
}

export default new BlogCategoryController();
