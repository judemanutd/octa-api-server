export const AUTH_ERROR_ID_TOKEN_REVOKED = "auth/id-token-revoked";
export const AUTH_ERROR_ID_TOKEN_EXPIRED = "auth/id-token-expired";
export const AUTH_ERROR_INTERNAL_ERROR = "auth/internal-error";

/**
 * Helper function to parse firebase error and generate meaningful error messages that can be returned
 *
 * @param {string} errorCode - error code from firebase
 *
 * @returns {string} - message that can be sent back to the user
 */
export const processFirebaseAuthError = (errorCode: string): string => {
  switch (errorCode) {
    case AUTH_ERROR_ID_TOKEN_REVOKED:
      return "Token has been revoked, please re-authenticate";

    case AUTH_ERROR_ID_TOKEN_EXPIRED:
      return "Token has expired, please re-authenticate";

    case AUTH_ERROR_INTERNAL_ERROR:
    default:
      return "Internal server error";
  }
};
