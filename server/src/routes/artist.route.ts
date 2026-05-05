import { Router } from "express";
import artistController from "../controllers/artist.controller";
import { validate } from "../middlewares/validate.middleware";
import {
    createArtistSchema,
    updateArtistSchema,
    getArtistSchema,
    listArtistSchema,
    deleteArtistSchema,
} from "../schema/artist.schema";
import { isAuth, restrictTo } from "../middlewares/auth.middleware";

const router = Router();

// public
router.get("/", validate(listArtistSchema), artistController.list);
router.get("/:id", validate(getArtistSchema), artistController.getDetail);

// admin only
router.use(isAuth, restrictTo("admin"));

router.post("/", validate(createArtistSchema), artistController.create);
router.patch("/:id", validate(updateArtistSchema), artistController.update);
router.delete("/", validate(deleteArtistSchema), artistController.delete);

export default router;
