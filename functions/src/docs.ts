import express, { Application } from "express";
import cors from "cors";
import swaggerUi from "swagger-ui-express";
import YAML from "yamljs";
import bodyParser from "body-parser";
import { generateAPIError } from "./middlewares/errors";
const swaggerDocument = YAML.load("../admin_api_doc.dev.yml");

// Express configuration
const app: Application = express();

// Automatically allow cross-origin requests
app.use(cors({ origin: true }));
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());

app.use("/", swaggerUi.serve, swaggerUi.setup(swaggerDocument));
app.use(generateAPIError);

export default app;
