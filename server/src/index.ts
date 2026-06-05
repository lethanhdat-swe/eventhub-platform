import { createServer } from "http";
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import router from "./routes";
import { initSocket } from "./socket";
import { startExpirePendingOrdersCron } from "./jobs";
import { UPLOADS_DIR } from "./middlewares/upload.middleware";
import { loggerMiddleware } from "./middlewares/logger.middleware";
import { rateLimitMiddleware } from "./middlewares/rate-limit.middleware";
import { responseMiddleware } from "./middlewares/response.middleware";
import { notFoundMiddleware } from "./middlewares/notfound.middleware";
import { errorMiddleware } from "./middlewares/error.middleware";

dotenv.config();

const app = express();

// Global Middlewares
app.use(cors());
app.use(express.json());
app.use(loggerMiddleware);
app.use(rateLimitMiddleware);
app.use(responseMiddleware);

// Routes
app.use("/api", router);
app.use("/uploads", express.static(UPLOADS_DIR));

// Error Handling Middlewares
app.use(notFoundMiddleware);
app.use(errorMiddleware);

const PORT = process.env.PORT || 8000;

const server = createServer(app);
initSocket(server);
startExpirePendingOrdersCron();

server.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
