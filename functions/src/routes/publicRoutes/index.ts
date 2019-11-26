import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import PortfolioController from "~controllers/PortfolioController";
import ProjectController from "~controllers/ProjectController";
import ComponentController from "~controllers/ComponentController";
import AnalyticsController from "~controllers/AnalyticsController";
import { KEY_REQUEST_ANALYTICS } from "~utils/constants";
import { IAnalyticsModel } from "~interfaces/IAnalyticsModel";

const router: Router = express.Router();

const portfolioController: PortfolioController = new PortfolioController();
const projectController: ProjectController = new ProjectController();
const componentController: ComponentController = new ComponentController();
const analyticsController: AnalyticsController = new AnalyticsController();

// fetch a single portfolio
router.get("/portfolio/:code", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioCode = req.params.code;

    const analytics: IAnalyticsModel = req[KEY_REQUEST_ANALYTICS];

    const result = await portfolioController.fetchPublicPortfolio(portfolioCode);

    if (analytics)
      // save analytics
      await analyticsController.logPortfolioRequest(result.id, analytics);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// fetch all components for a project
router.get(
  "/project/:projectId/component",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.projectId;

      const result = await componentController.fetchComponents(projectId, true);

      return response(res, successResponse(result));
    } catch (error) {
      next(error);
    }
  },
);

// fetch a single project
router.get("/project/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    const result = await projectController.fetchProject(projectId, true);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// fetch all projects
router.get("/project", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await projectController.fetchAllProjects(true);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
