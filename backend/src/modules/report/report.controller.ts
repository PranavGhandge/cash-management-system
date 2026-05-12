import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const getDailyReport = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    // 👉 Total deposit
    const [depositRows]: any = await db.query(
      `SELECT SUM(amount) as total FROM transactions 
       WHERE type='deposit' AND DATE(created_at)=?`,
      [today]
    );

    // 👉 Total withdrawal
    const [withdrawRows]: any = await db.query(
      `SELECT SUM(amount) as total FROM transactions 
       WHERE type='withdrawal' AND DATE(created_at)=?`,
      [today]
    );

    // 👉 Current balance
    const [balanceRows]: any = await db.query(
      "SELECT * FROM cash_balance WHERE date=?",
      [today]
    );

    if (balanceRows.length === 0) {
      return reply.status(404).send({
        message: "No data found ❌",
      });
    }

    const balance = balanceRows[0];

    // 👉 Total cash calculate
    const closingTotal =
      balance.note_500 * 500 +
      balance.note_200 * 200 +
      balance.note_100 * 100 +
      balance.note_50 * 50 +
      balance.note_20 * 20 +
      balance.note_10 * 10;

    return reply.send({
      total_deposit: depositRows[0].total || 0,
      total_withdrawal: withdrawRows[0].total || 0,
      closing_balance: closingTotal,
      notes: {
        note_500: balance.note_500,
        note_200: balance.note_200,
        note_100: balance.note_100,
        note_50: balance.note_50,
        note_20: balance.note_20,
        note_10: balance.note_10,
      },
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Server error",
    });
  }
};