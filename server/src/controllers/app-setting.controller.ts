import { NextFunction, Request, Response } from "express";
import appSettingService from "../services/app-setting.service";

class AppSettingController {
    getSiteSetting = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await appSettingService.getSiteSetting();
            return res.success({
                message: "Site settings fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    createSiteSetting = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await appSettingService.createSiteSetting(req.body);
            return res.success({
                message: "Site settings created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    updateSiteSetting = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const result = await appSettingService.upsertSiteSetting(req.body);
            return res.success({
                message: "Site settings updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteSiteSetting = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            await appSettingService.deleteSiteSetting();
            return res.success({
                message: "Site settings deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    createBanners = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const { imageUrls } = req.body;
            const result = await appSettingService.createBanners(imageUrls);
            return res.success({
                message: `${result.count} banner(s) created successfully.`,
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getBanners = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await appSettingService.getBanners();
            return res.success({
                message: "Banners fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    updateBanner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await appSettingService.updateBanner(
                req.params.id as string,
                req.body
            );
            return res.success({
                message: "Banner updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    deleteBanner = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await appSettingService.deleteBanner(req.params.id as string);
            return res.success({
                message: "Banner deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new AppSettingController();
