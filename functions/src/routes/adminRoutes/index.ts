import express, { Router } from "express";
import categoryRoutes from "./categoryRoute";

const router: Router = express.Router();

router.use("/category", categoryRoutes);

export default router;
