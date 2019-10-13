import APIError from "./APIError";
import { HTTP_NOT_FOUND } from "./http_code";

export const parseDbError = error => {
  try {
    switch (error.code) {
      case 5:
        return new APIError("Entity not found", error.stack, HTTP_NOT_FOUND);
      default:
        throw new Error();
    }
  } catch (error) {
    throw new APIError("Internal server error");
  }
};
