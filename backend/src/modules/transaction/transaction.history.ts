import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const getTransactions = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {
    try {
        const today = new Date().toISOString().split("T")[0];

        const [rows]: any = await db.query(
            `SELECT * FROM transactions
       WHERE DATE(created_at)=?
       ORDER BY id DESC`,
            [today]
        );

        return reply.send(rows);
    } catch (error) {
        return reply.status(500).send({
            message: "Server Error",
        });
    }
};