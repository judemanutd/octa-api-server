import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import ComponentController from "~controllers/ComponentController";

const router: Router = express.Router();

const componentController: ComponentController = new ComponentController();

// add a component to a project
router.post("/:projectId/component", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name;
    const projectId = req.params.projectId;
    const categoryId = req.body.categoryId;
    const technologyIds = req.body.technologyId;

    const result = await componentController.addComponent(
      name,
      projectId,
      categoryId,
      technologyIds,
    );

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
