import { Router } from "express";
import { validate } from "../middlewares/validate.middleware";
import searchController from "../controllers/search.controller";
import { searchSchema } from "../schema/search.schema";

const router = Router();

// Public search (không cần login)
router.get("/", validate(searchSchema), searchController.search);

export default router;
