import express, { Router, Request, Response, NextFunction } from "express";
import * as functions from "firebase-functions";
import cors from "cors";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";
import { authorize } from "~middlewares/authHelpers";
import { analytics } from "~middlewares/analyticsHelper";
import { routeNotFoundError } from "~exceptions/genericErrors";
import APIError from "~utils/APIError";
import { HTTP_FORBIDDEN } from "~utils/http_code";

const router: Router = express.Router();

const config = functions.config();
const env = config.ecosystem.env;

const whitelistOrigin = /\.octalogic\.in$/;
const corsOptions = {
  origin: (origin: string, callback: (arg0: Error, arg1: boolean) => void) => {
    if (whitelistOrigin.test(origin)) {
      callback(null, true);
    } else {
      callback(new APIError("Not allowed", null, HTTP_FORBIDDEN), false);
    }
  },
};

router.options("*", cors()); // Enabling CORS Pre-Flight
router.use(
  "/v1/admin",
  cors(env === "prod" ? corsOptions : { origin: true }),
  authorize(),
  adminRoutes,
);
router.use("/v1", cors({ origin: true }), analytics(), publicRoutes);

router.use("/*", (req: Request, res: Response, next: NextFunction) => {
  next(routeNotFoundError);
});

export default router;
