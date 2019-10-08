import express, { Request, Response, Router } from "express";
import { response, successResponse } from "../../utils/helpers";

const TAG = "functions/src/routes/adminRoutes/index.ts ===> ";

const router: Router = express.Router();

router.get("/bleh", (req: Request, res: Response) => {
  try {
    return response(
      res,
      successResponse({
        bleh: 1,
      }),
    );
  } catch (error) {
    console.error(TAG, error);
  }
});

export default router;
