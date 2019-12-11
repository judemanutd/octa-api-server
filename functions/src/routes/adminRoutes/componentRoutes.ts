import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import ComponentController from "~controllers/ComponentController";

const router: Router = express.Router();

const componentController: ComponentController = new ComponentController();

// fetch all components without attached data for select
router.get("/select", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await componentController.fetchComponentsForSelect();

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
