import { Router } from "express";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";
import UserController from "../controllers/user.controller";
import { validate } from "../middlewares/validate.middleware";
import {
    changePasswordSchema,
    updateMeSchema,
    changeRoleSchema,
    deleteUsersSchema,
    listUsersQuerySchema,
} from "../schema/user.schema";

const router = Router();

router.use(isAuth);

router.put("/update-me", validate(updateMeSchema), UserController.updateMe);

router.patch(
    "/change-password",
    validate(changePasswordSchema),
    UserController.changePassword
);

router.get(
    "/",
    restrictTo("ADMIN"),
    validate(listUsersQuerySchema),
    UserController.getAllUsers
);

router.patch(
    "/change-role",
    restrictTo("ADMIN"),
    validate(changeRoleSchema),
    UserController.changeRole
);

router.get(
    "/:id",
    restrictTo("ADMIN"),
    UserController.getUserById
);

router.delete(
    "/",
    restrictTo("ADMIN"),
    validate(deleteUsersSchema),
    UserController.deleteUsers
);

export default router;
