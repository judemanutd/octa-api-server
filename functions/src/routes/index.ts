import express, { Router, Request, Response, NextFunction } from "express";
import adminRoutes from "./adminRoutes";
import publicRoutes from "./publicRoutes";
import { authorize } from "~middlewares/authHelpers";
import { analytics } from "~middlewares/analyticsHelper";
import { routeNotFoundError } from "~exceptions/genericErrors";

const router: Router = express.Router();

router.use("/v1/admin", authorize(), adminRoutes);
router.use("/v1", analytics(), publicRoutes);

router.use("/*", (req: Request, res: Response, next: NextFunction) => {
  next(routeNotFoundError);
});

export default router;
