import express, { Router } from "express";
import adminRoutes from "./adminRoutes";
import { authorize } from "../utils/authHelpers";
import { response, errorResponse } from "../utils/helpers";

const TAG = " functions/src/routes/index.ts ===> ";

const router: Router = express.Router();

router.use("/v1/admin", authorize(), adminRoutes);

router.use("/*", (req, res) => {
  return response(res, errorResponse("Unknown path"));
});

export default router;
