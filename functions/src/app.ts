import express, { Application } from "express";
// import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";

// Express configuration
const app: Application = express();

// Automatically allow cross-origin requests
// app.use(helmet());
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(router);

export default app;
