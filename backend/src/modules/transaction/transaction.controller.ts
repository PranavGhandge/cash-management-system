import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const createTransaction = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const body: any = req.body;

    const {
      customer_name,
      bank_name,
      type,
      note_500 = 0,
      note_200 = 0,
      note_100 = 0,
      note_50 = 0,
      note_20 = 0,
      note_10 = 0,
    } = body;

    // ✅ Type validation
    if (type !== "deposit" && type !== "withdrawal") {
      return reply.status(400).send({
        message: "Invalid transaction type .",
      });
    }

    const today = new Date().toISOString().split("T")[0];

    // ✅ Lock row
    const [rows]: any = await conn.query(
      "SELECT * FROM cash_balance WHERE date = ? FOR UPDATE",
      [today]
    );

    if (rows.length === 0) {
      throw new Error("Opening balance not found .");
    }

    const current = rows[0];

    // ✅ Withdrawal validation
    if (type === "withdrawal") {
      if (
        note_500 > current.note_500 ||
        note_200 > current.note_200 ||
        note_100 > current.note_100 ||
        note_50 > current.note_50 ||
        note_20 > current.note_20 ||
        note_10 > current.note_10
      ) {
        return reply.status(400).send({
          message: "Insufficient notes balance .",
        });
      }
    }

    // ✅ Calculate new balance
    const calc = (oldVal: number, change: number) => {
      return type === "withdrawal"
        ? oldVal - change
        : oldVal + change;
    };

    const newBalance = {
      note_500: calc(current.note_500, note_500),
      note_200: calc(current.note_200, note_200),
      note_100: calc(current.note_100, note_100),
      note_50: calc(current.note_50, note_50),
      note_20: calc(current.note_20, note_20),
      note_10: calc(current.note_10, note_10),
    };

    // ✅ Total amount
    const amount =
      note_500 * 500 +
      note_200 * 200 +
      note_100 * 100 +
      note_50 * 50 +
      note_20 * 20 +
      note_10 * 10;

    // ✅ Update balance
    await conn.query(
      `UPDATE cash_balance SET
      note_500=?,
      note_200=?,
      note_100=?,
      note_50=?,
      note_20=?,
      note_10=?
      WHERE date=?`,
      [
        newBalance.note_500,
        newBalance.note_200,
        newBalance.note_100,
        newBalance.note_50,
        newBalance.note_20,
        newBalance.note_10,
        today,
      ]
    );

    // ✅ Save transaction
    await conn.query(
      `INSERT INTO transactions 
      (
        customer_name,
        bank_name,
        type,
        amount,
        note_500,
        note_200,
        note_100,
        note_50,
        note_20,
        note_10
      )
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        customer_name,
        bank_name,
        type,
        amount,
        note_500,
        note_200,
        note_100,
        note_50,
        note_20,
        note_10,
      ]
    );

    await conn.commit();

    return reply.send({
      message: "Transaction successful ✅",
      amount,
      newBalance,
    });
  } catch (error: any) {
    await conn.rollback();

    return reply.status(400).send({
      message: error.message,
    });
  } finally {
    conn.release();
  }
};