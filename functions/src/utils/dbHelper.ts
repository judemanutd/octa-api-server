import APIError from "./APIError";
import { HTTP_NOT_FOUND, HTTP_INTERNAL_SERVER_ERROR } from "./http_code";

export const parseDbError = error => {
  switch (error.code) {
    case 5:
      return new APIError("Entity not found", error.stack, HTTP_NOT_FOUND);
    default:
      handleGenericError(error);
      break;
  }
};

const handleGenericError = error => {
  if (error instanceof APIError) {
    // error has already been generated, return as is
    throw error;
  } else throw new APIError("Internal server error", error.stack, HTTP_INTERNAL_SERVER_ERROR);
};
