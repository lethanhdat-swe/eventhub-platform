import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import appSettingController from "../controllers/app-setting.controller";
import {
    createSiteSettingsSchema,
    updateSiteSettingsSchema,
    createBannersSchema,
    updateBannerSchema,
    deleteBannerSchema,
} from "../schema/app-setting.schema";

const router = Router();


router.use(isAuth, restrictTo("ADMIN"));


router.get("/site", appSettingController.getSiteSetting);
router.post("/site", validate(createSiteSettingsSchema), appSettingController.createSiteSetting);
router.put("/site", validate(updateSiteSettingsSchema), appSettingController.updateSiteSetting);
router.delete("/site", appSettingController.deleteSiteSetting);


router.get("/banners", appSettingController.getBanners);
router.post("/banners", validate(createBannersSchema), appSettingController.createBanners);
router.patch("/banners/:id", validate(updateBannerSchema), appSettingController.updateBanner);
router.delete("/banners/:id", validate(deleteBannerSchema), appSettingController.deleteBanner);

export default router;