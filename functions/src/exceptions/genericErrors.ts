import APIError from "~utils/APIError";
import { HTTP_UNPROCESSABLE_ENTITY, HTTP_NOT_FOUND } from "~utils/http_code";

export const missingParametersError = (message = "Request has missing parameters", error?) =>
  new APIError(message, error ? error.stack : undefined, HTTP_UNPROCESSABLE_ENTITY);

export const entityNotFoundError = (message = "Entity not found", error?) =>
  new APIError(message, error ? error.stack : undefined, HTTP_NOT_FOUND);

export const invalidDateError = (message = "Invalid date format", error?) =>
  new APIError(message, error ? error.stack : undefined, HTTP_UNPROCESSABLE_ENTITY);

export const routeNotFoundError = new APIError("API not found", undefined, HTTP_NOT_FOUND);
