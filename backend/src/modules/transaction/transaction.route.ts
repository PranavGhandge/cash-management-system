import { FastifyInstance } from "fastify";
import { createTransaction } from "./transaction.controller";
import { getTransactions } from "./transaction.history";
import { deleteTransaction } from "./transaction.delete";

export default async function transactionRoutes(app: FastifyInstance) {
  app.post("/transaction", createTransaction);

  // ✅ Get Today Transactions
  app.get("/transactions", getTransactions);

  app.delete("/transaction/:id", deleteTransaction);
}

