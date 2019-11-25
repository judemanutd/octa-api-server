import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import { generateAPIError } from "~middlewares/errors";
// import APIError from "~utils/APIError";
// import { HTTP_FORBIDDEN } from "~utils/http_code";

// Express configuration
const app: Application = express();

// TODO: uncomment when deploying to prod
/* const whitelist = [];
const corsOptions = {
  origin: (origin: string, callback: (arg0: Error, arg1: boolean) => void) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new APIError("Not allowed by CORS", null, HTTP_FORBIDDEN), false);
    }
  },
}; */

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);
app.use(generateAPIError);

export default app;
