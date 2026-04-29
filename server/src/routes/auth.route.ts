import { Router } from "express";
import AuthController from "../controllers/auth.controller";
import { validate } from "../middlewares/validate.middleware";
import {
    forgotPasswordSchema,
    googleLoginSchema,
    loginSchema,
    logoutSchema,
    refreshTokenSchema,
    registerSchema,
    resetPasswordSchema,
    verifyEmailSchema,
    verifyResetTokenSchema,
} from "../schema/auth.schema";

const router = Router();

router.post("/register", validate(registerSchema), AuthController.register);

router.post("/login", validate(loginSchema), AuthController.login);

router.post(
    "/google-login",
    validate(googleLoginSchema),
    AuthController.googleLogin
);
router.post(
    "/verify-email",
    validate(verifyEmailSchema),
    AuthController.verifyEmail
);

router.post(
    "/forgot-password",
    validate(forgotPasswordSchema),
    AuthController.forgotPassword
);

router.post(
    "/verify-reset-token",
    validate(verifyResetTokenSchema),
    AuthController.verifyResetToken
);

router.post(
    "/reset-password",
    validate(resetPasswordSchema),
    AuthController.resetPassword
);

router.post(
    "/refresh-token",
    validate(refreshTokenSchema),
    AuthController.refreshToken
);

router.post("/logout", validate(logoutSchema), AuthController.logout);

export default router;
