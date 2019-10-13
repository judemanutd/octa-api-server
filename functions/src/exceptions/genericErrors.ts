import APIError from "../utils/APIError";
import { HTTP_UNPROCESSABLE_ENTITY } from "../utils/http_code";

export const missingParametersError = (message = "Request has missing parameters", error?) =>
  new APIError(message, error ? error.stack : undefined, HTTP_UNPROCESSABLE_ENTITY);
