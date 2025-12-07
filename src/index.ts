import { ENV, PORT } from "@config";
import { logger } from "@logger";
import { csrf, verifyCsrf } from "@middlewares/csrf.middleware.js";
import { errorHandler } from "@middlewares/error.middleware.js";
import { loggerMiddleware } from "@middlewares/logger.middleware.js";
import { notFoundMiddleware } from "@middlewares/notFound.middleware.js";
import { authRouter } from "@routes/auth.routes.js";
import { csrfRouter } from "@routes/csrf.routes.js";
import { debugRouter } from "@routes/debug.routes.js";
import { healthCheckRouter } from "@routes/health.routes.js";
import { loginRouter } from "@routes/login.routes.js";
import { oauthRouter } from "@routes/oauth.routes.js";
import { registerRouter } from "@routes/register.routes.js";
import { vaultRouter } from "@routes/vault.routes.js";
import { connectMongo } from "@utils/database/mongo.js";
import { connectRedis } from "@utils/database/redis.js";
import cookieParser from "cookie-parser";
import cors from "cors";
import express, { type Express } from "express";
import helmet from "helmet";

logger.info("Starting server...");
const app: Express = express();

/* Middleware */
app.use(loggerMiddleware);
app.use(cors());
app.use(cookieParser());
app.use(csrf());
app.use(helmet());
app.use(express.json());

/* Routes */
app.use("/api/health", healthCheckRouter);
app.use("/api/csrf", csrfRouter);
app.use(verifyCsrf());
app.use("/api/register", registerRouter);
app.use("/api/login", loginRouter);
app.use("/api/oauth", oauthRouter);
app.use("/api/auth", authRouter);
app.use("/api/vault", vaultRouter);

/* Testing Routes */
if (["development", "test"].includes(ENV)) app.use("/api/debug", debugRouter);

/* Not Found  */
app.use(notFoundMiddleware);

/* Error Handler */
app.use(errorHandler);

/* Database Connection */
await connectMongo();
await connectRedis();

/* Start Server */
if (ENV !== "test")
    app.listen(PORT, () => {
        logger.info(`Server started on port ${PORT}`);
    });

export default app;
