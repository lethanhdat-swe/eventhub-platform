import { Request, Response, NextFunction } from "express";
import ArtistService from "../services/artist.service";

class ArtistController {
    constructor(private artistService: ArtistService) {}

    create = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.artistService.create(req.body);

            return res.success({
                message: "Artist created successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    list = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.artistService.list(req.query as any);

            return res.success({
                message: "Artists fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    getDetail = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.artistService.getDetail(
                req.params.id as string
            );

            return res.success({
                message: "Artist fetched successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    update = async (req: Request, res: Response, next: NextFunction) => {
        try {
            const result = await this.artistService.update(
                req.params.id as string,
                req.body
            );

            return res.success({
                message: "Artist updated successfully.",
                data: result,
            });
        } catch (error) {
            next(error);
        }
    };

    delete = async (req: Request, res: Response, next: NextFunction) => {
        try {
            await this.artistService.delete(req.body.ids);

            return res.success({
                message: "Artists deleted successfully.",
            });
        } catch (error) {
            next(error);
        }
    };
}

export default new ArtistController(new ArtistService());
