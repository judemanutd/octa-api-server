import { Request, Response, NextFunction } from "express";
import { HTTP_INTERNAL_SERVER_ERROR } from "../utils/http_code";
const env = process.env.NODE_ENV || "local";

const TAG = " functions/src/middlewares/errors.ts ===> ";

export const generateAPIError = (
  error,
  request: Request,
  response: Response,
  next: NextFunction,
) => {
  console.log("\n");
  console.error(TAG, error);
  console.log("\n");
  const errObj = {
    code: error.status || HTTP_INTERNAL_SERVER_ERROR,
    message: error.message || "Internal Server Error",
    application_code: error.code,
    stack: env === "development" || env === "local" ? error.stack : {},
  };

  if (env !== "development" && env !== "local") {
    delete errObj.stack;
  }

  return response.status(error.status).json({
    error: errObj,
  });
};
