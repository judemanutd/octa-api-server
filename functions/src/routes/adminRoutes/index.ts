import express, { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import technologyRoutes from "./technologyRoutes";
import clientRoutes from "./clientRoutes";
import projectRoutes from "./projectRoutes";

const router: Router = express.Router();

router.use("/category", categoryRoutes);
router.use("/technology", technologyRoutes);
router.use("/client", clientRoutes);
router.use("/project", projectRoutes);

export default router;
