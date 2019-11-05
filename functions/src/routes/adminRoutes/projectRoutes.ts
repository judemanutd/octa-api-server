import express, { Request, Response, Router, NextFunction } from "express";
import multer from "multer";
import path from "path";
import { response, successResponse } from "../../utils/helpers";
import { receiveFiles } from "../../utils/multerHelper";
import ProjectController from "../../controllers/ProjectController";

const router: Router = express.Router();

/* const storage = multer.diskStorage({
  destination: (request, file, callback) => {
    console.log("TCL", file);
    callback(null, PUBLIC_UPLOAD_PATH);
  },
  filename: (request, file, callback) => {
    const ext = path.extname(file.originalname).toLowerCase();
    console.log("TCL", ext);
    const fileName = uuid() + "_" + ext;
    callback(null, fileName);
  },
}); */

/* const upload = multer({
  storage: multer.memoryStorage(),
}); */

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

// const upload = multer({ dest: "uploads/" });

const projectController: ProjectController = new ProjectController();

// router.use(multer({ storage: multer.memoryStorage() }).single("profile"));

// add a cover image to a project
router.post("/cover/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const uploads = await receiveFiles(multipartFormDataParser, req, res);

    const projectId = req.params.projectId;

    const result = await projectController.addCoverImage(projectId, uploads);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// delete cover image for a project
router.delete("/cover/:projectId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const projectId = req.params.projectId;

    const result = await projectController.deleteCoverImage(projectId);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// quick add a project, called when creating a new basic project
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    // const uploads = await receiveFiles(multipartFormDataParser, req, res);

    // const coverImage = req.files.length === 1 ? req.files[0] : undefined;
    // console.log("TCL: coverImage", coverImage);

    const name = req.body.name;
    const clientId = req.body.clientId;
    const startDate = req.body.startDate;
    const endDate = req.body.endDate;
    const cost = req.body.cost;
    const currency = req.body.currency;

    const result = await projectController.addProject(
      name,
      clientId,
      startDate,
      endDate,
      cost,
      currency,
    );

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// fetch all projects in the system
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await projectController.fetchAllProjects();

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
