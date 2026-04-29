import { Router } from "express";
import { isAuth } from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
    changePasswordSchema,
    updateMeSchema,
    changeRoleSchema,
    deleteUsersSchema,
} from "../schema/user.schema";
import { paginationQuerySchema } from "../schema/pagination.schema";

const router = Router();

router.use(isAuth);

router.put("/update-me", validate(updateMeSchema), UserController.updateMe);

router.patch(
    "/change-password",
    validate(changePasswordSchema),
    UserController.changePassword
);

// Admin
router.get("/", validate(paginationQuerySchema), UserController.getAllUsers);

router.get("/:id", UserController.getUserById);

router.patch(
    "/change-role",
    validate(changeRoleSchema),
    UserController.changeRole
);

router.delete("/", validate(deleteUsersSchema), UserController.deleteUsers);

export default router;
