import express from "express";
import cors from "cors";
import { connectDB } from "./config/DB/connection";
import { env } from "./config/env/env";
import "./config/DB/Models";
import cookieParser from "cookie-parser";

import { errorHandler } from "./middleware/Error/error.middleware";
import routerHandler from "./utils/RouterHandler/routerHandler";

const bootstrap = async (app: express.Application): Promise<void> => {
  const allowedOrigins = env.ALLOWED_ORIGINS
    ? env.ALLOWED_ORIGINS.split(",").map((origin) => origin.trim())
    : env.FRONTEND_URL
      ? [env.FRONTEND_URL]
      : [];

  const vercelPreviewPatterns = env.VERCEL_PREVIEW_PATTERNS
    ? env.VERCEL_PREVIEW_PATTERNS.split(",").map((pattern) => pattern.trim())
    : [];

  const corsOptions: cors.CorsOptions = {
    origin: (origin, callback) => {
      if (!origin) {
        return callback(null, true);
      }

      const normalizedOrigin = origin.endsWith("/")
        ? origin.slice(0, -1)
        : origin;

      if (allowedOrigins.includes(normalizedOrigin)) {
        return callback(null, true);
      }

      if (vercelPreviewPatterns.length > 0) {
        const isPreview = vercelPreviewPatterns.some((pattern) => {
          const regexPattern = "^" + pattern.replace(/\*/g, "[^.]+") + "$";
          const regex = new RegExp(regexPattern, "i");
          return regex.test(normalizedOrigin);
        });

        if (isPreview) {
          return callback(null, true);
        }
      }

      return callback(new Error(`Origin ${origin} is not allowed by CORS`));
    },
    credentials: true,
    methods: ["GET", "POST", "PUT", "PATCH", "DELETE", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization", "Cookie"],
  };

  app.use(cors(corsOptions));

  app.use("/api/v1/stripe/webhook", express.raw({ type: "*/*" }));
  app.use(express.json());
  app.use(cookieParser());

  await connectDB();

 

  await routerHandler(app);

  app.use(errorHandler);
};

export default bootstrap;
