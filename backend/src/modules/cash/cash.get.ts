import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const getTodayBalance = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  try {
    const today = new Date().toISOString().split("T")[0];

    const [rows]: any = await db.query(
      "SELECT * FROM cash_balance WHERE date = ?",
      [today]
    );

    if (rows.length === 0) {
      return reply.status(404).send({
        message: "No data found for today ❌",
      });
    }

    const data = rows[0];

    const total =
      data.note_500 * 500 +
      data.note_200 * 200 +
      data.note_100 * 100 +
      data.note_50 * 50 +
      data.note_20 * 20 +
      data.note_10 * 10;

    return reply.send({
      notes: {
        note_500: data.note_500,
        note_200: data.note_200,
        note_100: data.note_100,
        note_50: data.note_50,
        note_20: data.note_20,
        note_10: data.note_10,
      },
      total_amount: total,
    });
  } catch (error) {
    return reply.status(500).send({
      message: "Server error",
    });
  }
};