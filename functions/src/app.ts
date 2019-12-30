import express, { Application } from "express";
import bodyParser from "body-parser";
import router from "./routes";
import { generateAPIError } from "~middlewares/errors";

// Express configuration
const app: Application = express();

app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
app.use(router);
app.use(generateAPIError);

export default app;
