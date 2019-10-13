import { Response } from "express";
import { HTTP_OK } from "./http_code";

const RESPONSE_PAYLOAD_KEY = "payload";

/**
 * encapsulates the logic for sending a response back
 *
 * @param {Response} res - response object
 * @param {any} payload - payload to be sent back
 */
export const response = (res: Response, payload: any) => res.status(HTTP_OK).json(payload);

/**
 * helper function to return a successful response
 *
 * @param {any} payload - success payload
 */
export const successResponse = <T>(payload: T) => ({ [RESPONSE_PAYLOAD_KEY]: payload });

/**
 * helper to checked required fields
 *
 * @param {any} args - parameters that need to be checked
 */
export const setRequired = (...args: any): boolean => {
  let isValid = true;
  args.forEach((value: any) => {
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

/**
 * used to convert createdAt and updatedAt fields from firestore to human readable
 *
 * @param {any} row - document in firestore
 */
export const parseRow = row => {
  try {
    if (row.createdAt) {
      row.createdAt = row.createdAt.toDate();
    }
    if (row.updatedAt) {
      row.updatedAt = row.updatedAt.toDate();
    }

    return row;
  } catch (error) {
    throw error;
  }
};
