import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { response, errorResponse } from "./helpers";
import { HTTP_FORBIDDEN, HTTP_UNAUTHORIZED_ACCESS } from "./http_code";
import { processFirebaseAuthError, AUTH_ERROR_ID_TOKEN_EXPIRED } from "./firebase_auth_helper";

const TAG = "Authorize ===> ";

/**
 * Helper function to verify a firebase id token,
 * It will return a decoded token on success else it will throw an error,
 * use the processFirebaseAuthError function in firebase_auth_helpers to process the error
 *
 * @param {string} token - token that needs to be verified
 * @param {boolean} check_revoked - checks if token has been revoked
 */
const verifyToken = (token: string, checkRevoked: boolean = true) =>
  admin.auth().verifyIdToken(token, checkRevoked);

/**
 * ADMIN
 *
 * validate a route for admin
 *
 */
export const authorize = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (!req.headers.authorization || !req.headers.authorization.startsWith("Bearer ")) {
      // user does not have any authentication
      res.locals.auth = null;

      return response(
        res,
        errorResponse("Missing Authorization Credentials", "Forbidden", HTTP_FORBIDDEN),
      );
    } else {
      try {
        const token: string[] = req.headers.authorization.split(" ");
        const decodedToken = await verifyToken(token[1], true);

        res.locals.auth = decodedToken;
        next();
      } catch (error) {
        console.error(TAG, error);

        // check to see if the token has expired, if so then send an unauthorized so the user can refresh the token and re-query
        if (error.code === AUTH_ERROR_ID_TOKEN_EXPIRED) {
          res.locals.auth = null;
          return response(
            res,
            errorResponse(
              processFirebaseAuthError(error.code),
              undefined,
              HTTP_UNAUTHORIZED_ACCESS,
            ),
          );
        }

        res.locals.auth = null;
        return response(
          res,
          errorResponse(processFirebaseAuthError(error.code), undefined, HTTP_FORBIDDEN),
        );
      }
    }
  } catch (error) {
    console.error(TAG, error);
    return response(
      res,
      errorResponse(
        "An error occured while authorizing, please try again later",
        "Forbidden",
        HTTP_FORBIDDEN,
      ),
    );
  }
};
