import express, { Router, Request, Response, NextFunction } from "express";
import { authorize } from "../middlewares/authHelpers";
import { routeNotFoundError } from "../exceptions/genericErrors";

const router: Router = express.Router();

const customRouter = (route?: express.Router) => {
  // if a route is specified then use that
  if (route) {
    router.use("/*", authorize(), route);
  } else {
    // throw route not found error
    router.use("/*", (req: Request, res: Response, next: NextFunction) => {
      next(routeNotFoundError);
    });
  }
  return router;
};

export default customRouter;
