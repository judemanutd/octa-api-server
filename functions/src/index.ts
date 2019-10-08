import * as functions from "firebase-functions";
import server from "./app";
import { connectToServer } from "./utils/db";

connectToServer(functions);

export const api = functions
  .runWith({
    memory: "2GB",
  })
  .https.onRequest(server);
