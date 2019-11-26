import APIError from "~utils/APIError";
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED_ACCESS } from "~utils/http_code";

export const missingAuthError = new APIError(
  "Missing Authorization Credentials",
  undefined,
  HTTP_FORBIDDEN,
);

export const unAuthorizedError = (message: string) =>
  new APIError("Missing Authorization Credentials", undefined, HTTP_UNAUTHORIZED_ACCESS);
