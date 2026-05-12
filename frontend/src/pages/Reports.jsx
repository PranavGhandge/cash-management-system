import { useEffect, useState } from "react";

import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function Reports() {

    const API = "http://localhost:3000";

    const [transactions, setTransactions] =
        useState([]);

    const [balance, setBalance] =
        useState(null);

    const [selectedDate, setSelectedDate] =
        useState("");

    // ================= GET TRANSACTIONS =================

    const getTransactions = async () => {

        try {

            const res = await fetch(
                API + "/transactions"
            );

            const data = await res.json();

            setTransactions(data);

        } catch (err) {

            console.log(err);

        }
    };

    // ================= GET BALANCE =================

    const getBalance = async () => {

        try {

            const res = await fetch(
                API + "/balance"
            );

            const data = await res.json();

            setBalance(data);

        } catch (err) {

            console.log(err);

        }
    };

    // ================= AUTO REFRESH =================

    useEffect(() => {

        getTransactions();
        getBalance();

        const interval = setInterval(() => {

            getTransactions();
            getBalance();

        }, 2000);

        return () => clearInterval(interval);

    }, []);

    // ================= TOTALS =================

    const totalCash =
        balance?.total_amount || 0;

    const totalDeposit = transactions
        .filter((t) => t.type === "deposit")
        .reduce(
            (sum, item) =>
                sum + Number(item.amount),
            0
        );

    const totalWithdrawal = transactions
        .filter((t) => t.type === "withdrawal")
        .reduce(
            (sum, item) =>
                sum + Number(item.amount),
            0
        );


    const filteredTransactions =
        transactions.filter((item) => {

            if (!selectedDate) return true;

            const transactionDate =
                new Date(item.created_at)
                    .toISOString()
                    .split("T")[0];

            return transactionDate === selectedDate;
        });

  
        // ================= PDF DOWNLOAD =================

    const downloadPDF = () => {

        const doc = new jsPDF();

        // HEADER

        doc.setFillColor(30, 60, 114);

        doc.rect(0, 0, 220, 30, "F");

        doc.setTextColor(255, 255, 255);

        doc.setFontSize(24);

        doc.text(
            "Daily Cash Management Report",
            55,
            20
        );

        // DATE

        doc.setTextColor(0);

        doc.setFontSize(13);

        doc.text(
            `Selected Date : ${selectedDate || "All Dates"
            }`,
            14,
            42
        );

        // ================= SUMMARY CARDS =================

        // Deposit

        doc.setFillColor(22, 163, 74);

        doc.roundedRect(
            14,
            52,
            52,
            24,
            4,
            4,
            "F"
        );

        doc.setTextColor(255);

        doc.setFontSize(12);

        doc.text(
            `Deposit : Rs. ${totalDeposit}`,
            20,
            66
        );

        // Withdrawal

        doc.setFillColor(220, 38, 38);

        doc.roundedRect(
            80,
            52,
            52,
            24,
            4,
            4,
            "F"
        );

        doc.text(
            `Withdraw : Rs. ${totalWithdrawal}`,
            86,
            66
        );

        // Balance

        doc.setFillColor(37, 99, 235);

        doc.roundedRect(
            146,
            52,
            52,
            24,
            4,
            4,
            "F"
        );

        doc.text(
            `Balance : Rs. ${totalCash}`,
            152,
            66
        );

        // ================= NOTES =================

        doc.setTextColor(0);

        doc.setFontSize(16);

        doc.text(
            "Remaining Notes",
            14,
            95
        );

        doc.setFontSize(12);

        doc.text(
            `500 : ${balance?.notes?.note_500 || 0}`,
            16,
            108
        );

        doc.text(
            `200 : ${balance?.notes?.note_200 || 0}`,
            16,
            118
        );

        doc.text(
            `100 : ${balance?.notes?.note_100 || 0}`,
            16,
            128
        );

        doc.text(
            `50 : ${balance?.notes?.note_50 || 0}`,
            80,
            108
        );

        doc.text(
            `20 : ${balance?.notes?.note_20 || 0}`,
            80,
            118
        );

        doc.text(
            `10 : ${balance?.notes?.note_10 || 0}`,
            80,
            128
        );

        // ================= TABLE =================

        autoTable(doc, {

            startY: 140,

            head: [[
                "Customer",
                "Bank",
                "Type",
                "Amount",
                "Time"
            ]],

            body: filteredTransactions.map(
                (item) => [

                    item.customer_name,

                    item.bank_name,

                    item.type,

                    `Rs. ${item.amount}`,

                    new Date(
                        item.created_at
                    ).toLocaleTimeString(),
                ]
            ),

            theme: "grid",

            headStyles: {
                fillColor: [30, 60, 114],
                halign: "center",
                fontSize: 11,
            },

            bodyStyles: {
                halign: "center",
                fontSize: 10,
            },

            alternateRowStyles: {
                fillColor: [240, 244, 248],
            },
        });

        // ================= FOOTER =================

        const pageHeight =
            doc.internal.pageSize.height;

        doc.setFontSize(10);

        doc.setTextColor(120);

        doc.text(
            "Generated by Cash Management System",
            14,
            pageHeight - 10
        );

        // SAVE

        doc.save("cash-report.pdf");
    };

    // ================= BANK TOTAL =================

    const bankTotals = {};

    transactions.forEach((item) => {

        if (!bankTotals[item.bank_name]) {

            bankTotals[item.bank_name] = 0;

        }

        bankTotals[item.bank_name] += Number(
            item.amount
        );

    });

    return (

        <div className="ml-64 p-8 bg-[#f4f7fb] min-h-screen space-y-6">

            {/* TOP */}

            <div className="bg-white rounded-2xl p-6 shadow flex items-center justify-between">

    <div>

        <h1 className="text-3xl font-bold">
            Reports & Analytics
        </h1>

        <p className="text-gray-500 mt-2">
            Download and view reports
        </p>

    </div>

    {/* RIGHT SIDE */}

    <div className="flex items-center gap-4">

        <input
            type="date"
            value={selectedDate}
            onChange={(e) =>
                setSelectedDate(e.target.value)
            }
            className="border p-3 rounded-xl outline-none"
        />

        <button
            onClick={downloadPDF}
            className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold"
        >
            Download PDF
        </button>

    </div>

</div>

            {/* SUMMARY */}

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                <div className="bg-green-500 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Total Deposit
                    </h2>

                    <h1 className="text-4xl font-bold mt-3">
                        ₹ {totalDeposit}
                    </h1>

                </div>

                <div className="bg-red-500 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Total Withdrawal
                    </h2>

                    <h1 className="text-4xl font-bold mt-3">
                        ₹ {totalWithdrawal}
                    </h1>

                </div>

                <div className="bg-blue-600 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Current Balance
                    </h2>

                    <h1 className="text-4xl font-bold mt-3">
                        ₹ {totalCash}
                    </h1>

                </div>

            </div>

        </div>
    );
}

export default Reports;