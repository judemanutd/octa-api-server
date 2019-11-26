import { Request, Response, NextFunction } from "express";
import { KEY_REQUEST_ANALYTICS } from "~utils/constants";
// tslint:disable-next-line: no-var-requires
const parser = require("ua-parser-js");

export const analytics = () => async (req: Request, res: Response, next: NextFunction) => {
  try {
    // save parsed user agent
    const agent = parser(req.headers["user-agent"]);

    req[KEY_REQUEST_ANALYTICS] = {
      agent,
    };

    next();
  } catch (error) {
    throw error;
  }
};
