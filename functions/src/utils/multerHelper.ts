import { Request, Response, RequestHandler } from "express";
import { IMulterFileUpload } from "../interfaces/IMulterFileUpload";

/**
 * middleware handler for multer upload with error handling
 *
 * @param {RequestHandler} multerParser - middleware that handles the multer object
 * @param {Request} req  - express request object
 * @param {Response} res - express response object
 */
export const receiveFiles = (
  multerParser: RequestHandler,
  req: Request,
  res: Response,
): Promise<IMulterFileUpload[]> => {
  try {
    return new Promise((resolve, reject) =>
      multerParser(req, res, err => {
        if (err) reject(err);
        else resolve((req.files as unknown) as IMulterFileUpload[]);
      }),
    );
  } catch (error) {
    throw error;
  }
};
