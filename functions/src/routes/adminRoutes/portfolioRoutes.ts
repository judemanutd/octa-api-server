import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import PortfolioController from "~controllers/PortfolioController";

const router: Router = express.Router();

const portfolioController: PortfolioController = new PortfolioController();

// add a portfolio
router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = req.body.payload;

    const result = await portfolioController.addPortfolio(payload);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// update a single portfolio
router.put("/:portfolioId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;
    const payload = req.body.payload;

    const result = await portfolioController.updatePortfolio(portfolioId, payload);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// archived a portfolio
router.delete("/:portfolioId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;

    const result = await portfolioController.archivePortfolio(portfolioId);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// fetch a single portfolio
router.get("/:portfolioId", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const portfolioId = req.params.portfolioId;

    const fetchDetails = !!req.query.detailed;
    const result = await portfolioController.fetchPortFolio(portfolioId, fetchDetails);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

// fetch all portfolios
router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await portfolioController.fetchPortfolios();

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
