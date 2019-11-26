import * as admin from "firebase-admin";
import { Request, Response, NextFunction } from "express";
import { processFirebaseAuthError, AUTH_ERROR_ID_TOKEN_EXPIRED } from "~utils/firebaseAuthHelper";
import { missingAuthError, unAuthorizedError } from "~exceptions/authErrors";

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

      throw missingAuthError;
    } else {
      try {
        const token: string[] = req.headers.authorization.split(" ");
        // TODO: make email verification required
        const decodedToken = await verifyToken(token[1], false);

        res.locals.auth = decodedToken;
        next();
      } catch (error) {
        // check to see if the token has expired, if so then send an unauthorized so the user can refresh the token and re-query
        if (error.code === AUTH_ERROR_ID_TOKEN_EXPIRED) {
          res.locals.auth = null;
          throw unAuthorizedError(processFirebaseAuthError(error.code));
        }

        res.locals.auth = null;
        throw unAuthorizedError(processFirebaseAuthError(error.code));
      }
    }
  } catch (error) {
    next(error);
  }
};
