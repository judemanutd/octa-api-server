import express, { Router } from "express";
import categoryRoutes from "./categoryRoutes";
import technologyRoutes from "./technologyRoutes";
import clientRoutes from "./clientRoutes";
import projectRoutes from "./projectRoutes";
import portfolioRoutes from "./portfolioRoutes";
import componentRoutes from "./componentRoutes";

const router: Router = express.Router();

router.use("/category", categoryRoutes);
router.use("/technology", technologyRoutes);
router.use("/client", clientRoutes);
router.use("/project", projectRoutes);
router.use("/portfolio", portfolioRoutes);
router.use("/component", componentRoutes);

export default router;
