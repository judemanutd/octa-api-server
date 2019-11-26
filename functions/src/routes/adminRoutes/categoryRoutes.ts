import express, { Request, Response, Router, NextFunction } from "express";
import { response, successResponse } from "~utils/helpers";
import CategoryController from "~controllers/CategoryController";
import { IIcon } from "~interfaces/IIcon";

const router: Router = express.Router();

const categoryController: CategoryController = new CategoryController();

router.get("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const result = await categoryController.fetchCategories();
    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.post("/", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const name: string = req.body.name;
    const icon_type: string = req.body.icon_type;
    const icon_name: string = req.body.icon_name;

    let icon: IIcon;
    if (icon_type && icon_name) {
      icon = {
        type: icon_type,
        name: icon_name,
      };
    }

    const result = await categoryController.addCategory(name, icon);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.put("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id;
    const name: string = req.body.name;
    const icon_type: string = req.body.icon_type;
    const icon_name: string = req.body.icon_name;

    let icon: IIcon;
    if (icon_type && icon_name) {
      icon = {
        type: icon_type,
        name: icon_name,
      };
    }

    const result = await categoryController.updateCategory(id, name, icon);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

router.delete("/:id", async (req: Request, res: Response, next: NextFunction) => {
  try {
    const id: string = req.params.id;

    const result = await categoryController.archiveCategory(id);

    return response(res, successResponse(result));
  } catch (error) {
    next(error);
  }
});

export default router;
