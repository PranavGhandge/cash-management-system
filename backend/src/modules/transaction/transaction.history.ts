import { FastifyRequest, FastifyReply } from "fastify";
import { db } from "../../plugins/db";

export const getTransactions = async (
    req: FastifyRequest,
    reply: FastifyReply
) => {

    try {

        // ================= SELECTED DATE =================

        const selectedDate =
            (req.query as any).date ||
            new Date().toISOString().split("T")[0];

        // ================= GET TRANSACTIONS =================

        const [rows]: any = await db.query(

            `SELECT * FROM transactions
       WHERE DATE(created_at)=?
       ORDER BY id DESC`,

            [selectedDate]

        );

        // ================= RESPONSE =================

        return reply.send(rows);

    } catch (error) {

        console.log(error);

        return reply.status(500).send({
            message: "Server Error ❌",
        });

    }
};