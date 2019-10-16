import express, { Router } from "express";
import categoryRoutes from "./categoryRoute";
import technologyRoutes from "./technologyRoutes";

const router: Router = express.Router();

router.use("/category", categoryRoutes);
router.use("/technology", technologyRoutes);

export default router;
