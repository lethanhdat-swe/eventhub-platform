import { Request, Response, NextFunction } from "express";
import categoryService from "../services/category.service";

class CategoryController {
    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await categoryService.create(req.body);

            return res.success({
                message: "Category created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await categoryService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Category updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await categoryService.list(req.query as any);

            return res.success({
                message: "Categories fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await categoryService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Category fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { ids } = req.body;
            await categoryService.delete(ids);

            return res.success({
                message: "Categories deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new CategoryController();
