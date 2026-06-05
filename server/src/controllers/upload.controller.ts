import { Request, Response, NextFunction } from "express";
import uploadService from "../services/upload.service";
import { AppError } from "../utils/AppError";

class UploadController {
    uploadImage = async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (!req.file) {
                throw new AppError("No image file provided", 400);
            }
            const data = uploadService.buildFilePayload(req.file.filename);
            return res.success({
                message: "Upload image successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    };

    uploadImages = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const files = req.files as Express.Multer.File[] | undefined;
            if (!files || files.length === 0) {
                throw new AppError("No image file provided", 400);
            }
            const data = files.map((f) =>
                uploadService.buildFilePayload(f.filename)
            );
            return res.success({
                message: "Upload images successfully",
                data,
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new UploadController();
