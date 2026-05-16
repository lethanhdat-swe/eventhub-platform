import { Router } from "express";
import uploadController from "../controllers/upload.controller";
import { isAuth } from "../middlewares/auth.middleware";
import {
    uploadSingleImage,
    uploadMultipleImages,
} from "../middlewares/upload.middleware";

const router = Router();

router.post("/image", isAuth, uploadSingleImage, uploadController.uploadImage);
router.post(
    "/images",
    isAuth,
    uploadMultipleImages,
    uploadController.uploadImages
);

export default router;
