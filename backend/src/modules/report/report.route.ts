import { FastifyInstance } from "fastify";
import { getDailyReport } from "./report.controller";

export default async function reportRoutes(app: FastifyInstance) {
  app.get("/report", getDailyReport);
}