import { Request, Response, NextFunction } from "express";
// import * as functions from "firebase-functions";
// import phin from "phin";
// import requestIp from "request-ip";
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

    /* const clientIp = requestIp.getClientIp(req);
    const ipKey = functions.config().ip.api_key;

    if (clientIp && ipKey) {
      const result = await phin({
        url: `http://api.ipstack.com/${clientIp}?access_key=${ipKey}&format=1`,
        method: "GET",
        parse: "json",
      });

      // save geo location data
      req[KEY_REQUEST_ANALYTICS].location = result.body;
    } */

    next();
  } catch (error) {
    throw error;
  }
};
