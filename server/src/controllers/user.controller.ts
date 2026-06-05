import { Request, Response, NextFunction } from "express";
import userService from "../services/user.service";

class UserController {
    updateMe = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const userId = req.user?.id;
            const result = await userService.updateMe(userId!, req.body);

            return res.success({
                message: "Profile updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    changePassword = async (
        req: Request,
        res: Response,
        next: NextFunction
    ) => {
        try {
            const userId = req.user?.id;

            await userService.changePassword(userId!, req.body);

            return res.success({
                message: "Password changed successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    getAllUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userService.getAllUsers(req.query as any);

            return res.success({
                message: "Users fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getUserById = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await userService.getUserById(
                req.params.id as string
            );

            return res.success({
                message: "User fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    changeRole = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.changeRole({
                actorId: req.user!.id,
                userId: req.body.userId as string,
                role: req.body.role as string,
            });

            return res.success({
                message: "User role updated successfully.",
            });
        } catch (error) {
            next(error);
        }
    };

    deleteUsers = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await userService.deleteUsers(req.user!.id, req.body.userIds);

            return res.success({
                message: "Users deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new UserController();
