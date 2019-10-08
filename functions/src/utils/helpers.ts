import { Response } from "express";
import { HTTP_OK, HTTP_INTERNAL_SERVER_ERROR } from "./http_code";
import { IResponse } from "../interfaces/IResponse";

const RESPONSE_ERROR_KEY = "error";
const RESPONSE_PAYLOAD_KEY = "payload";

export const response = <T>(res: Response, payload: T) => {
  const isError: boolean = payload[RESPONSE_ERROR_KEY] ? true : false;

  if (isError) {
    // error response

    const err = payload as IResponse;

    // removing the meta data field since it is for debugging purposes only and not for the client
    delete err.error.metadata;

    return res.status(err.error.status).send(err);
  } else {
    // success response
    return res.status(HTTP_OK).send(payload);
  }
};

/**
 * helper function to return a successful response
 *
 * @param {any} payload - success payload
 */
export const successResponse = <T>(payload: T) => ({ [RESPONSE_PAYLOAD_KEY]: payload });

/**
 * helper function to return an error response
 *
 * @param {string} error_user_msg - an error message that can be displayed to the user
 * @param {string} error_user_title - a title that can be shown to the user
 * @param {number} http_status_code - http status code for the error message
 * @param {string} application_code - an optional application code if exists
 * @param {string} message - technical message for debug purposes
 */
export const errorResponse = (
  errorUserMsg: string = "Internal Server Error",
  errorUserTitle: string = "Error",
  httpStatusCode: number = HTTP_INTERNAL_SERVER_ERROR,
  applicationCode?: string,
  message?: string,
  metadata?: any,
) => {
  // logging all errors

  const obj = {
    errorUserMsg,
    errorUserTitle,
    status: httpStatusCode,
    code: applicationCode,
    message,
    metadata,
  };

  return {
    [RESPONSE_ERROR_KEY]: obj,
  };
};

/**
 * helper to checked required fields
 *
 * @param {any} args - parameters that need to be checked
 */
export const setRequired = (...args: any): boolean => {
  let isValid = true;
  args.forEach(value => {
    if (value === undefined || value === null) {
      isValid = false;
    }
  });
  return isValid;
};

/**
 * helper for converting cookie payload to array
 *
 * @param {string} cookie_payload - cookie payload that needs to be parsed
 */
export const parseCookies = (cookiePayload: string) => {
  const list = [];

  if (cookiePayload && cookiePayload.length > 0) {
    cookiePayload.split(";").forEach(cookie => {
      const parts = cookie.split("=");
      list[parts.shift().trim()] = decodeURI(parts.join("="));
    });
  }

  return list;
};
