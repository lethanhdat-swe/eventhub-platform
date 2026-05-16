import crypto from "crypto";
import fs from "fs";
import multer from "multer";
import path from "path";
import { AppError } from "../utils/AppError";

export const UPLOADS_DIR = path.join(__dirname, "../../uploads");

const MAX_FILE_SIZE = 5 * 1024 * 1024;
const MAX_IMAGES = 10;

const ALLOWED_EXTENSIONS = new Set([".jpg", ".jpeg", ".png", ".webp"]);

function ensureUploadsDir() {
    if (!fs.existsSync(UPLOADS_DIR)) {
        fs.mkdirSync(UPLOADS_DIR, { recursive: true });
    }
}

ensureUploadsDir();

const storage = multer.diskStorage({
    destination: (_req, _file, cb) => {
        ensureUploadsDir();
        cb(null, UPLOADS_DIR);
    },
    filename: (_req, file, cb) => {
        const ext = path.extname(file.originalname).toLowerCase();
        const name = `${Date.now()}-${crypto.randomBytes(8).toString("hex")}${ext}`;
        cb(null, name);
    },
});

const imageFileFilter: multer.Options["fileFilter"] = (_req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    if (!ALLOWED_EXTENSIONS.has(ext)) {
        return cb(
            new AppError(
                "Invalid file type. Only jpg, jpeg, png, and webp are allowed",
                400
            )
        );
    }
    cb(null, true);
};

const imageUpload = multer({
    storage,
    limits: { fileSize: MAX_FILE_SIZE },
    fileFilter: imageFileFilter,
});

export const uploadSingleImage = imageUpload.single("image");
export const uploadMultipleImages = imageUpload.array("images", MAX_IMAGES);
