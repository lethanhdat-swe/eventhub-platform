import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import { validate } from "../middlewares/validate.middleware";
import couponController from "../controllers/coupon.controller";
import {
    verifyCouponSchema,
    listCouponSchema,
    getCouponSchema,
    createCouponSchema,
    updateCouponSchema,
    deleteBulkCouponSchema,
} from "../schema/coupon.schema";

const router = Router();

router.post("/verify", validate(verifyCouponSchema), couponController.verify);

router.use(isAuth, restrictTo("ADMIN"));

router.get("/", validate(listCouponSchema), couponController.list);

router.get("/:id", validate(getCouponSchema), couponController.getDetail);

router.post("/", validate(createCouponSchema), couponController.create);

router.patch("/:id", validate(updateCouponSchema), couponController.update);

router.delete("/", validate(deleteBulkCouponSchema), couponController.deleteMany);
router.delete("/:id", couponController.delete);

export default router;
