import express, { Application } from "express";
import * as functions from "firebase-functions";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import { generateAPIError } from "~middlewares/errors";
import APIError from "~utils/APIError";
import { HTTP_FORBIDDEN } from "~utils/http_code";
// import APIError from "~utils/APIError";
// import { HTTP_FORBIDDEN } from "~utils/http_code";

// Express configuration
const app: Application = express();

const config = functions.config();
const env = config.ecosystem.env;

const whitelist = ["https://portfolio-panel.octalogic.in/"];
const corsOptions = {
  origin: (origin: string, callback: (arg0: Error, arg1: boolean) => void) => {
    if (whitelist.includes(origin)) {
      callback(null, true);
    } else {
      callback(new APIError("Not allowed by CORS", null, HTTP_FORBIDDEN), false);
    }
  },
};

// Automatically allow cross-origin requests
app.use(cors(env === "prod" ? corsOptions : { origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);
app.use(generateAPIError);

export default app;
