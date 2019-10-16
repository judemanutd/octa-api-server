import express, { Application } from "express";
// import helmet from "helmet";
import cors from "cors";
import bodyParser from "body-parser";
import router from "./routes";
import { generateAPIError } from "./middlewares/errors";

// Express configuration
const app: Application = express();

// Automatically allow cross-origin requests
// app.use(helmet());
app.use(cors({ origin: true }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

const customRouter = (route?: express.Router) => {
  app.use(router(route));
  app.use(generateAPIError);

  return app;
};

export default customRouter;
