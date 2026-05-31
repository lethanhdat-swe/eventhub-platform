import { Router } from "express";
import uploadController from "../controllers/upload.controller";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import {
    uploadSingleImage,
    uploadMultipleImages,
} from "../middlewares/upload.middleware";

const router = Router();

router.use(isAuth);

router.post("/image", uploadSingleImage, uploadController.uploadImage);
router.post("/images", uploadMultipleImages, uploadController.uploadImages);

export default router;
