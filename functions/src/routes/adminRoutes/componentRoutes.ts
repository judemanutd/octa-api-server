import express, { Request, Response, Router, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { response, successResponse } from "~utils/helpers";
import { receiveFiles } from "~utils/multerHelper";
import ComponentController from "~controllers/ComponentController";

const multerOptions: any = {
  storage: multer.memoryStorage(),
  fileFilter: (req, file, callback) => {
    const ext = path.extname(file.originalname);
    if (ext !== ".png" && ext !== ".jpg" && ext !== ".jpeg") {
      return callback(new Error("Only images are allowed"));
    }
    return callback(null, true);
  },
  limits: {
    // 1MB
    fileSize: 1024 * 1024,
  },
  // increase size limit if needed
  // support firebase cloud functions
  // the multipart form-data request object is pre-processed by the cloud functions
  // currently the `multer` library doesn't natively support this behaviour
  // as such, a custom fork is maintained to enable this by adding `startProcessing`
  // https://github.com/emadalam/multer
  startProcessing(req, busboy) {
    req.rawBody ? busboy.end(req.rawBody) : req.pipe(busboy);
  },
};
const multipartFormDataParser = multer(multerOptions).any();

const router: Router = express.Router();

const componentController: ComponentController = new ComponentController();

// add a cover image to a component
router.post(
  "/:projectId/component/:componentId/cover/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const uploads = await receiveFiles(multipartFormDataParser, req, res);

      const projectId = req.params.projectId;
      const componentId = req.params.componentId;

      const result = await componentController.addCoverImage(projectId, componentId, uploads);

      return response(res, successResponse(result));
    } catch (error) {
      next(error);
    }
  },
);

// delete cover image for a project
router.delete(
  "/:projectId/component/:componentId/cover/",
  async (req: Request, res: Response, next: NextFunction) => {
    try {
      const projectId = req.params.projectId;
      const componentId = req.params.componentId;

      const result = await componentController.deleteCoverImage(projectId, componentId);

      return response(res, successResponse(result));
    } catch (error) {
      next(error);
    }
  },
);

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
