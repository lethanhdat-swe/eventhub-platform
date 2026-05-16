import { Request, Response, NextFunction } from "express";
import contactService from "../services/contact.service";

class ContactController {
  create = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const result = await contactService.create(req.body);
      res.status(201).json({ success: true, data: result });
    } catch (error) {
      next(error);
    }
  };

  list = async (req: Request, res: Response, next: NextFunction) => {
    try {
      const page = Number(req.query.page) || 1;
      const limit = Number(req.query.limit) || 10;
      const result = await contactService.list(page, limit);
      res.json({ success: true, ...result });
    } catch (error) {
      next(error);
    }
  };

  delete = async (req: Request, res: Response, next: NextFunction) => {
    try {
      await contactService.delete(req.params.id as string);
      res.json({ success: true, message: "Xóa liên hệ thành công" });
    } catch (error) {
      next(error);
    }
  };
}

export default new ContactController();