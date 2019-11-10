import express, { Application } from "express";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import { generateAPIError } from "~middlewares/errors";

// Express configuration
const app: Application = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use(router);
app.use(generateAPIError);

export default app;
