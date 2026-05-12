import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const deleteTransaction = async (
  req: FastifyRequest,
  reply: FastifyReply
) => {
  const conn = await db.getConnection();

  try {
    await conn.beginTransaction();

    const { id }: any = req.params;

    // 👉 Get transaction
    const [rows]: any = await conn.query(
      "SELECT * FROM transactions WHERE id=?",
      [id]
    );

    if (rows.length === 0) {
      throw new Error("Transaction not found ❌");
    }

    const txn = rows[0];

    const today = new Date().toISOString().split("T")[0];

    // 👉 Get balance
    const [balanceRows]: any = await conn.query(
      "SELECT * FROM cash_balance WHERE date=? FOR UPDATE",
      [today]
    );

    const balance = balanceRows[0];

    // 👉 Reverse balance
    const calc = (
      oldVal: number,
      change: number
    ) => {
      return txn.type === "deposit"
        ? oldVal - change
        : oldVal + change;
    };

    // 👉 Update balance
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
        calc(balance.note_500, txn.note_500),
        calc(balance.note_200, txn.note_200),
        calc(balance.note_100, txn.note_100),
        calc(balance.note_50, txn.note_50),
        calc(balance.note_20, txn.note_20),
        calc(balance.note_10, txn.note_10),
        today,
      ]
    );

    // 👉 Delete transaction
    await conn.query(
      "DELETE FROM transactions WHERE id=?",
      [id]
    );

    await conn.commit();

    return reply.send({
      message: "Transaction Deleted ✅",
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