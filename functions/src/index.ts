import * as functions from "firebase-functions";
import app from "./app";
import { connectToServer } from "./utils/db";
import categoryRoutes from "./routes/adminRoutes/categoryRoute";
import technologyRoutes from "./routes/adminRoutes/technologyRoutes";

connectToServer(functions);

const config: functions.RuntimeOptions = {
  memory: "2GB",
};

export const category = functions.runWith(config).https.onRequest(app(categoryRoutes));
export const technology = functions.runWith(config).https.onRequest(app(technologyRoutes));
export const error = functions.runWith(config).https.onRequest(app());
