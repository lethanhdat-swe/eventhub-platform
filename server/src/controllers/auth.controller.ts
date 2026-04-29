import { Request, Response, NextFunction } from "express";
import AuthService from "../services/auth.service";

class AuthController {
    async register(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.register(req.body);
            return res.success({
                message: "Registration successful. Please check your email to verify your account.",
                data: result,
                status: 201,
            });
        } catch (error) {
            next(error);
        }
    }

    async login(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.login(req.body);
            return res.success({
                message: "Login successful.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async verifyEmail(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            const result = await AuthService.verifyEmail(token);
            return res.success({
                message: "Email verified successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async forgotPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const { email } = req.body;
            const result = await AuthService.forgotPassword(email);
            return res.success(result);
        } catch (error) {
            next(error);
        }
    }

    async verifyResetToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { token } = req.body;
            const result = await AuthService.verifyResetToken(token);
            return res.success(result);
        } catch (error) {
            next(error);
        }
    }

    async resetPassword(req: Request, res: Response, next: NextFunction) {
        try {
            const result = await AuthService.resetPassword(req.body);
            return res.success(result);
        } catch (error) {
            next(error);
        }
    }

    async refreshToken(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.refreshToken(refreshToken);
            return res.success({
                message: "Tokens refreshed successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }

    async logout(req: Request, res: Response, next: NextFunction) {
        try {
            const { refreshToken } = req.body;
            const result = await AuthService.logout(refreshToken);
            return res.success(result);
        } catch (error) {
            next(error);
        }
    }

    async googleLogin(req: Request, res: Response, next: NextFunction) {
        try {
            const { idToken } = req.body;
            const result = await AuthService.googleLogin(idToken);
            return res.success({
                message: "Google login successful.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    }
}

export default new AuthController();
