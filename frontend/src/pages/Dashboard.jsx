import { useEffect, useState } from "react";

import {
    FaMoneyBillWave,
    FaUniversity,
    FaArrowDown,
    FaArrowUp,
} from "react-icons/fa";

import { BiBarChartAlt2 } from "react-icons/bi";

import { MdDashboard } from "react-icons/md";

import {
    PieChart,
    Pie,
    Cell,
    Tooltip,
    ResponsiveContainer,
    BarChart,
    Bar,
    XAxis,
    YAxis,
    CartesianGrid,
} from "recharts";

const API = "http://localhost:3000";

function Dashboard() {

    const [balance, setBalance] = useState(null);

    const [transactions, setTransactions] =
        useState([]);

    // ================= GET BALANCE =================

    const getBalance = async () => {

        try {

            const res = await fetch(
                API + "/balance"
            );

            const data = await res.json();

            if (res.ok) {
                setBalance(data);
            }

        } catch (err) {

            console.log(err);

        }
    };

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

    useEffect(() => {

        getBalance();

        getTransactions();

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
        .filter(
            (t) => t.type === "withdrawal"
        )
        .reduce(
            (sum, item) =>
                sum + Number(item.amount),
            0
        );

    // ================= PIE DATA =================

    const pieData = [
        {
            name: "Deposit",
            value: totalDeposit,
        },

        {
            name: "Withdrawal",
            value: totalWithdrawal,
        },
    ];

    const COLORS = [
        "#16a34a",
        "#dc2626",
    ];

    // ================= BANK DATA =================

    const bankData = [

        {
            bank: "SBI",

            amount: transactions
                .filter(
                    (t) => t.bank_name === "SBI"
                )
                .reduce(
                    (sum, item) =>
                        sum + Number(item.amount),
                    0
                ),
        },

        {
            bank: "Maharashtra",

            amount: transactions
                .filter(
                    (t) =>
                        t.bank_name ===
                        "Maharashtra Bank"
                )
                .reduce(
                    (sum, item) =>
                        sum + Number(item.amount),
                    0
                ),
        },

        {
            bank: "Airtel",

            amount: transactions
                .filter(
                    (t) =>
                        t.bank_name ===
                        "Airtel Bank"
                )
                .reduce(
                    (sum, item) =>
                        sum + Number(item.amount),
                    0
                ),
        },
    ];

    return (

        <div className="ml-64 p-6 bg-[#f4f7fb] min-h-screen overflow-hidden">

            {/* ================= HEADER ================= */}

            <div className="flex items-center gap-3 mb-6">

                <MdDashboard className="text-blue-900 text-4xl" />

                <h1 className="text-4xl font-bold">
                    Dashboard
                </h1>

            </div>


            {/* ================= TOP CARDS ================= */}

            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-12 gap-5 mb-6">

                {/* CURRENT CASH */}

                <div className="bg-white rounded-2xl shadow p-5 h-[180px] xl:col-span-3">

                    <h2 className="flex items-center gap-2 text-xl font-bold">

                        <FaMoneyBillWave className="text-green-600 text-3xl" />

                        Current Cash

                    </h2>

                    <h1 className="text-4xl font-bold text-green-600 mt-6">

                        ₹ {totalCash}

                    </h1>

                </div>

                {/* REMAINING NOTES */}

                <div className="bg-white rounded-2xl shadow p-5 h-[180px] xl:col-span-3">

                    <h2 className="flex items-center gap-2 text-xl font-bold mb-3">

                        <FaUniversity className="text-blue-700 text-2xl" />

                        Remaining Notes

                    </h2>

                    {/* 3 - 3 NOTES */}

                    <div className="grid grid-cols-2 gap-y-4 text-gray-700 text-base font-medium">

                        <div>₹500 : {balance?.notes?.note_500 || 0}</div>

                        <div>₹200 : {balance?.notes?.note_200 || 0}</div>

                        <div>₹100 : {balance?.notes?.note_100 || 0}</div>

                        <div>₹50 : {balance?.notes?.note_50 || 0}</div>

                        <div>₹20 : {balance?.notes?.note_20 || 0}</div>

                        <div>₹10 : {balance?.notes?.note_10 || 0}</div>

                    </div>

                </div>

                {/* DEPOSIT */}

                <div className="bg-white rounded-2xl shadow p-5 h-[180px] xl:col-span-3">

                    <h2 className="flex items-center gap-2 text-xl font-bold">

                        <FaArrowDown className="text-green-600 text-3xl" />

                        Deposit

                    </h2>

                    <h1 className="text-4xl font-bold mt-6">

                        ₹ {totalDeposit}

                    </h1>

                </div>

                {/* WITHDRAWAL */}

                <div className="bg-white rounded-2xl shadow p-5 h-[180px] xl:col-span-3">

                    <h2 className="flex items-center gap-2 text-xl font-bold">

                        <FaArrowUp className="text-red-600 text-3xl" />

                        Withdrawal

                    </h2>

                    <h1 className="text-4xl font-bold mt-6">

                        ₹ {totalWithdrawal}

                    </h1>

                </div>

            </div>

            {/* ================= CHARTS ================= */}

            <div className="grid grid-cols-1 xl:grid-cols-2 gap-5">

                {/* PIE CHART */}

                <div className="bg-white rounded-2xl shadow p-5 h-[340px]">

                    <div className="flex items-center gap-3 mb-4">

                        <BiBarChartAlt2 className="text-blue-700 text-3xl" />

                        <h2 className="text-2xl font-bold">
                            Deposit vs Withdrawal
                        </h2>

                    </div>

                    <div className="w-full h-[220px]">

                        <ResponsiveContainer>

                            <PieChart>

                                <Pie
                                    data={pieData}
                                    dataKey="value"
                                    outerRadius={70}
                                    label
                                >

                                    {pieData.map(
                                        (entry, index) => (
                                            <Cell
                                                key={index}
                                                fill={
                                                    COLORS[index]
                                                }
                                            />
                                        )
                                    )}

                                </Pie>

                                <Tooltip />

                            </PieChart>

                        </ResponsiveContainer>

                    </div>

                </div>

                {/* BAR CHART */}

                <div className="bg-white rounded-2xl shadow p-5 h-[340px]">

                    <div className="flex items-center gap-3 mb-4">

                        <FaUniversity className="text-indigo-700 text-3xl" />

                        <h2 className="text-2xl font-bold">
                            Bank Wise Transactions
                        </h2>

                    </div>

                    <div className="w-full h-[220px]">

                        <ResponsiveContainer>

                            <BarChart data={bankData}>

                                <CartesianGrid strokeDasharray="3 3" />

                                <XAxis dataKey="bank" />

                                <YAxis />

                                <Tooltip />

                                <Bar
                                    dataKey="amount"
                                    fill="#1e3c72"
                                    radius={[10, 10, 0, 0]}
                                    barSize={45}
                                />

                            </BarChart>

                        </ResponsiveContainer>

                    </div>

                </div>

            </div>
        </div>
    );
}

export default Dashboard;