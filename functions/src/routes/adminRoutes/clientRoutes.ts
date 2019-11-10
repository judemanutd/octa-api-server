import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import ClientController from "~controllers/ClientController";

const router: Router = express.Router();

const clientController: ClientController = new ClientController();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await clientController.fetchClients();
    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name: string = req.body.name;
    const address: string = req.body.address;

    const result = await clientController.addClient(name, address);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id;
    const name: string = req.body.name;
    const address: string = req.body.address;

    const result = await clientController.updateClient(id, name, address);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id;

    const result = await clientController.archiveClient(id);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
