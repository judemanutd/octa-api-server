import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import ComponentController from "~controllers/ComponentController";

const router: Router = express.Router();

const componentController: ComponentController = new ComponentController();

// update a component for a project
router.put(
  "/:projectId/component/:componentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const name = req.body.name;
      const summary = req.body.summary;
      const description = req.body.description;
      const projectId = req.params.projectId;
      const componentId = req.params.componentId;
      const categoryId = req.body.categoryId;
      const technologyIds = req.body.technologyId;
      const links = req.body.links;

      const result = await componentController.updateComponent(
        componentId,
        projectId,
        name,
        categoryId,
        technologyIds,
        links,
        summary,
        description,
      );

      return response(res, successResponse(result));
    } catch (error) {
      next(error);
    }
  },
);

// fetch a single component for a project
router.get(
  "/:projectId/component/:componentId",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const componentId = req.params.componentId;

      const result = await componentController.fetchComponent(componentId);

      return response(res, successResponse(result));
    } catch (error) {
      next(error);
    }
  },
);

// fetch all components for a project
router.get("/:projectId/component", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    const result = await componentController.fetchComponents(projectId);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// add a component to a project
router.post("/:projectId/component", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name = req.body.name;
    const summary = req.body.summary;
    const description = req.body.description;
    const projectId = req.params.projectId;
    const categoryId = req.body.categoryId;
    const technologyIds = req.body.technologyId;
    const links = req.body.links;

    const result = await componentController.addComponent(
      name,
      projectId,
      categoryId,
      technologyIds,
      links,
      summary,
      description,
    );

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
