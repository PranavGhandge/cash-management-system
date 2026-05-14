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

    const [reportData, setReportData] =
        useState(null);

    // ================= GET TRANSACTIONS =================

    const getTransactions = async () => {

        try {

            const url = selectedDate

                ? API +
                "/transactions?date=" +
                selectedDate

                : API + "/transactions";

            const res = await fetch(url);

            const data = await res.json();

            setTransactions(data);

        } catch (err) {

            console.log(err);

        }
    };

    // ================= GET BALANCE =================

    const getBalance = async () => {

        try {

            const url = selectedDate

                ? API +
                "/balance?date=" +
                selectedDate

                : API + "/balance";

            const res = await fetch(url);

            const data = await res.json();

            setBalance(data);

        } catch (err) {

            console.log(err);

        }
    };

    // ================= GET REPORT =================

    const getReport = async () => {

        try {

            const url = selectedDate

                ? API +
                "/report?date=" +
                selectedDate

                : API + "/report";

            const res = await fetch(url);

            const data = await res.json();

            if (res.ok) {

                setReportData(data);

            }

        } catch (err) {

            console.log(err);

        }
    };

    // ================= LOAD DATA =================

    useEffect(() => {

        getTransactions();

        getBalance();

        getReport();

        const interval = setInterval(() => {

            getTransactions();

            getBalance();

            getReport();

        }, 2000);

        return () => clearInterval(interval);

    }, [selectedDate]);

    // ================= TOTALS =================

    const totalCash =
        reportData?.closing_balance || 0;

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

    // ================= PDF DOWNLOAD =================

    const downloadPDF = () => {

        const reportTransactions = transactions;

        const reportDeposit = reportTransactions
            .filter((t) => t.type === "deposit")
            .reduce(
                (sum, item) =>
                    sum + Number(item.amount),
                0
            );

        const reportWithdrawal = reportTransactions
            .filter(
                (t) => t.type === "withdrawal"
            )
            .reduce(
                (sum, item) =>
                    sum + Number(item.amount),
                0
            );

        const doc = new jsPDF();

        // ================= HEADER =================

        doc.setFillColor(30, 60, 114);

        doc.rect(0, 0, 220, 30, "F");

        doc.setTextColor(255, 255, 255);

        doc.setFontSize(18);

        doc.text(
            "Daily Cash Management Report",
            35,
            20
        );

        // ================= DATE =================

        doc.setTextColor(0);

        doc.setFontSize(12);

        doc.text(
            `Selected Date : ${selectedDate || "Today"
            }`,
            14,
            42
        );

        // ================= SUMMARY =================

        // Deposit

        doc.setFillColor(22, 163, 74);

        doc.roundedRect(
            10,
            52,
            55,
            24,
            4,
            4,
            "F"
        );

        doc.setTextColor(255);

        doc.setFontSize(11);

        doc.text(
            `Deposit : Rs. ${reportDeposit}`,
            15,
            66
        );

        // Withdrawal

        doc.setFillColor(220, 38, 38);

        doc.roundedRect(
            77,
            52,
            55,
            24,
            4,
            4,
            "F"
        );

        doc.text(
            `Withdraw : Rs. ${reportWithdrawal}`,
            82,
            66
        );

        // Balance

        doc.setFillColor(37, 99, 235);

        doc.roundedRect(
            144,
            52,
            55,
            24,
            4,
            4,
            "F"
        );

        doc.text(
            `Balance : Rs. ${reportData?.closing_balance || 0}`,
            149,
            66
        );

        // ================= NOTES =================

        doc.setTextColor(0);

        doc.setFontSize(15);

        doc.text(
            "Remaining Notes",
            14,
            95
        );

        doc.setFontSize(11);

        doc.text(
            `500 : ${reportData?.notes?.note_500 || 0}`,
            16,
            108
        );

        doc.text(
            `200 : ${reportData?.notes?.note_200 || 0}`,
            16,
            118
        );

        doc.text(
            `100 : ${reportData?.notes?.note_100 || 0}`,
            16,
            128
        );

        doc.text(
            `50 : ${reportData?.notes?.note_50 || 0}`,
            80,
            108
        );

        doc.text(
            `20 : ${reportData?.notes?.note_20 || 0}`,
            80,
            118
        );

        doc.text(
            `10 : ${reportData?.notes?.note_10 || 0}`,
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

            body: reportTransactions.map(
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

            styles: {
                fontSize: 9,
            },

            headStyles: {
                fillColor: [30, 60, 114],
                halign: "center",
            },

            bodyStyles: {
                halign: "center",
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

        // ================= SAVE =================

        doc.save(
            `cash-report-${selectedDate || "today"}.pdf`
        );
    };

    return (

        <div className="bg-[#f4f7fb] min-h-screen space-y-6">

            {/* ================= TOP ================= */}

            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow flex flex-col lg:flex-row gap-5 lg:items-center lg:justify-between">

                <div>

                    <h1 className="text-2xl sm:text-3xl font-bold">
                        Reports & Analytics
                    </h1>

                    <p className="text-gray-500 mt-2 text-sm sm:text-base">
                        Download and view reports
                    </p>

                </div>

                {/* RIGHT SIDE */}

                <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-4 w-full lg:w-auto">

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(e.target.value)
                        }
                        className="border p-3 rounded-xl outline-none w-full sm:w-auto"
                    />

                    <button
                        onClick={downloadPDF}
                        className="bg-blue-900 hover:bg-blue-800 text-white px-5 py-3 rounded-xl font-bold w-full sm:w-auto"
                    >
                        Download PDF
                    </button>

                </div>

            </div>

            {/* ================= SUMMARY ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">

                <div className="bg-green-500 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Total Deposit
                    </h2>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-3 break-words">
                        ₹ {totalDeposit}
                    </h1>

                </div>

                <div className="bg-red-500 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Total Withdrawal
                    </h2>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-3 break-words">
                        ₹ {totalWithdrawal}
                    </h1>

                </div>

                <div className="bg-blue-600 text-white rounded-2xl p-6 shadow">

                    <h2 className="text-lg">
                        Current Balance
                    </h2>

                    <h1 className="text-3xl sm:text-4xl font-bold mt-3 break-words">
                        ₹ {totalCash}
                    </h1>

                </div>

            </div>

            {/* ================= TRANSACTION TABLE ================= */}

            <div className="bg-white rounded-2xl shadow p-4 sm:p-6 overflow-x-auto">

                <h2 className="text-2xl font-bold mb-5">
                    Transactions
                </h2>

                <table className="w-full min-w-[700px] border-collapse">

                    <thead>

                        <tr className="bg-[#1e3c72] text-white">

                            <th className="p-4">
                                Customer
                            </th>

                            <th className="p-4">
                                Bank
                            </th>

                            <th className="p-4">
                                Type
                            </th>

                            <th className="p-4">
                                Amount
                            </th>

                            <th className="p-4">
                                Time
                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {transactions.map((item) => (

                            <tr
                                key={item.id}
                                className="border-b text-center"
                            >

                                <td className="p-4">
                                    {item.customer_name}
                                </td>

                                <td className="p-4">
                                    {item.bank_name}
                                </td>

                                <td
                                    className={`p-4 font-bold ${item.type ===
                                            "deposit"
                                            ? "text-green-600"
                                            : "text-red-600"
                                        }`}
                                >
                                    {item.type}
                                </td>

                                <td className="p-4">
                                    ₹ {item.amount}
                                </td>

                                <td className="p-4">
                                    {new Date(
                                        item.created_at
                                    ).toLocaleTimeString()}
                                </td>

                            </tr>

                        ))}

                    </tbody>

                </table>

            </div>

        </div>
    );
}

export default Reports;