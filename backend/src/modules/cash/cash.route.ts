import { FastifyInstance } from "fastify";
import { createOpeningBalance } from "./cash.controller";
import { getTodayBalance } from "./cash.get";

export default async function cashRoutes(app: FastifyInstance) {
  app.post("/opening", createOpeningBalance);
  app.get("/balance", getTodayBalance);
}