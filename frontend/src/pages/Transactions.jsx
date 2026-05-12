import { useEffect, useState } from "react";
import {
    FaExchangeAlt,
    FaPlusCircle,
    FaHistory,
} from "react-icons/fa";
import {
    FaCheckCircle,
    FaUniversity,
} from "react-icons/fa";

import toast, {
    Toaster,
} from "react-hot-toast";

const API = "http://localhost:3000";

function Transactions() {

    const [balance, setBalance] =
        useState(null);

    // ================= OPENING =================

    const [opening, setOpening] =
        useState({
            note_500: "",
            note_200: "",
            note_100: "",
            note_50: "",
            note_20: "",
            note_10: "",
        });

    // ================= TRANSACTION =================

    const [txn, setTxn] = useState({
        customer_name: "",
        bank_name: "",
        type: "",

        note_500: "",
        note_200: "",
        note_100: "",
        note_50: "",
        note_20: "",
        note_10: "",
    });

    // ================= TRANSACTIONS =================

    const [transactions, setTransactions] =
        useState([]);

    const [search, setSearch] =
        useState("");

    const [bankFilter, setBankFilter] =
        useState("");

    const [selectedDate, setSelectedDate] =
        useState("");

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

    // ================= OPENING SAVE =================

    const handleOpening = async () => {

        // ================= TOTAL =================

        const openingTotal =

            Number(opening.note_500 || 0) * 500 +
            Number(opening.note_200 || 0) * 200 +
            Number(opening.note_100 || 0) * 100 +
            Number(opening.note_50 || 0) * 50 +
            Number(opening.note_20 || 0) * 20 +
            Number(opening.note_10 || 0) * 10;

        // ================= VALIDATION =================

        if (openingTotal <= 0) {

            toast.error(
                "Enter Opening Balance"
            );

            return;
        }

        try {

            const res = await fetch(
                API + "/opening",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({

                        note_500: Number(
                            opening.note_500 || 0
                        ),

                        note_200: Number(
                            opening.note_200 || 0
                        ),

                        note_100: Number(
                            opening.note_100 || 0
                        ),

                        note_50: Number(
                            opening.note_50 || 0
                        ),

                        note_20: Number(
                            opening.note_20 || 0
                        ),

                        note_10: Number(
                            opening.note_10 || 0
                        ),

                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                showOpeningToast();

                getBalance();

                setOpening({

                    note_500: "",
                    note_200: "",
                    note_100: "",
                    note_50: "",
                    note_20: "",
                    note_10: "",

                });

            } else {

                toast.error(
                    data.message
                );

            }

        } catch (err) {

            toast.error(
                "Something went wrong "
            );

        }
    };

    // ================= TOTAL =================

    const transactionTotal =
        Number(txn.note_500 || 0) * 500 +
        Number(txn.note_200 || 0) * 200 +
        Number(txn.note_100 || 0) * 100 +
        Number(txn.note_50 || 0) * 50 +
        Number(txn.note_20 || 0) * 20 +
        Number(txn.note_10 || 0) * 10;

    // ================= TRANSACTION =================

    const handleTxn = async () => {

        if (!txn.customer_name) {

            showWarningToast("Enter Customer Name ");

            return;
        }

        if (!txn.bank_name) {

            showWarningToast("Select Bank ");

            return;
        }

        if (!txn.type) {

            showWarningToast("Select Transaction Type ");

            return;
        }

        if (transactionTotal <= 0) {

            showWarningToast("Enter Notes Count ");

            return;
        }

        try {

            const res = await fetch(
                API + "/transaction",
                {
                    method: "POST",

                    headers: {
                        "Content-Type":
                            "application/json",
                    },

                    body: JSON.stringify({
                        customer_name:
                            txn.customer_name,

                        bank_name:
                            txn.bank_name,

                        type: txn.type,

                        note_500: Number(
                            txn.note_500 || 0
                        ),

                        note_200: Number(
                            txn.note_200 || 0
                        ),

                        note_100: Number(
                            txn.note_100 || 0
                        ),

                        note_50: Number(
                            txn.note_50 || 0
                        ),

                        note_20: Number(
                            txn.note_20 || 0
                        ),

                        note_10: Number(
                            txn.note_10 || 0
                        ),
                    }),
                }
            );

            const data = await res.json();

            if (res.ok) {

                if (txn.type === "deposit") {

                    showDepositToast();

                } else {

                    showWithdrawalToast();

                }

                getBalance();

                getTransactions();

                setTxn({
                    customer_name: "",
                    bank_name: "",
                    type: "",

                    note_500: "",
                    note_200: "",
                    note_100: "",
                    note_50: "",
                    note_20: "",
                    note_10: "",
                });

            } else {

                toast.error(data.message);

            }

        } catch (err) {

            toast.error(
                "Transaction Failed "
            );

        }
    };



    // ================= DELETE =================

    const handleDelete = async (id) => {

        toast((t) => (

            <div className="flex flex-col gap-3">

                <h2 className="font-bold text-black">
                    Delete this transaction?
                </h2>

                <div className="flex gap-2">

                    <button
                        onClick={async () => {

                            toast.dismiss(t.id);

                            try {

                                const res = await fetch(
                                    API + "/transaction/" + id,
                                    {
                                        method: "DELETE",
                                    }
                                );

                                const data = await res.json();

                                if (res.ok) {

                                    toast.success(
                                        "Transaction Deleted Successfully"
                                    );

                                    getTransactions();
                                    getBalance();

                                } else {

                                    toast.error(data.message);

                                }

                            } catch (err) {

                                toast.error(
                                    "Delete Failed"
                                );

                            }
                        }}

                        className="bg-red-500 text-white px-4 py-2 rounded-lg"
                    >
                        Yes Delete
                    </button>

                    <button
                        onClick={() =>
                            toast.dismiss(t.id)
                        }

                        className="bg-gray-300 px-4 py-2 rounded-lg"
                    >
                        Cancel
                    </button>

                </div>

            </div>
        ));
    };

    // ================= FILTER =================

    const filteredTransactions = transactions.filter(
        (item) => {

            const matchSearch =
                item.customer_name
                    .toLowerCase()
                    .includes(search.toLowerCase());

            const matchBank =
                bankFilter === ""
                    ? true
                    : item.bank_name === bankFilter;

            const transactionDate =
                new Date(item.created_at)
                    .toISOString()
                    .split("T")[0];

            const matchDate =
                selectedDate === ""
                    ? true
                    : transactionDate === selectedDate;

            return (
                matchSearch &&
                matchBank &&
                matchDate
            );
        }
    );

    // ================= CUSTOM TOAST =================

    const showDepositToast = () => {

        toast(
            "Cash Deposit Successfully",

            {
                icon: "✅",

                style: {
                    background: "#16a34a",
                    color: "white",
                    minWidth: "340px",
                    maxWidth: "340px",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "700",
                },
            }
        );
    };

    const showWithdrawalToast = () => {

        toast(
            "Cash Withdraw Successfully ",

            {
                icon: "✅",

                style: {
                    background: "#facc15",
                    color: "black",
                    minWidth: "340px",
                    maxWidth: "340px",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "700",
                },
            }
        );
    };

    const showOpeningToast = () => {

        toast(
            "Opening Balance Added Successfully",

            {
                icon: "✅",

                style: {
                    background: "#0ea5e9",
                    color: "white",
                    minWidth: "340px",
                    maxWidth: "340px",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "700",
                },
            }
        );
    };

    const showWarningToast = (msg) => {

        toast(
            msg,

            {
                icon: "⚠️",

                style: {
                    background: "#dc2626",
                    color: "white",
                    minWidth: "340px",
                    maxWidth: "340px",
                    padding: "16px 20px",
                    borderRadius: "16px",
                    fontSize: "15px",
                    fontWeight: "700",
                },
            }
        );
    };

    return (

        <div className="ml-64 p-8 bg-[#f4f7fb] min-h-screen">

            <Toaster
                position="bottom-right"

                toastOptions={{

                    duration: 3000,

                    style: {
                        minWidth: "340px",
                        maxWidth: "340px",
                        padding: "16px 20px",
                        borderRadius: "16px",
                        fontSize: "15px",
                        fontWeight: "700",
                        color: "white",
                    },

                    success: {
                        style: {
                            background: "#16a34a",
                        },
                    },

                    error: {
                        style: {
                            background: "#dc2626",
                        },
                    },
                }}
            />

            {/* ================= HEADER ================= */}

            <h1 className="flex items-center gap-3 text-4xl font-bold mb-8">
                <FaExchangeAlt className="text-blue-700" />
                Transactions
            </h1>

            {/* ================= OPENING ================= */}

            {
                balance?.total_amount > 0 ? (

                    <div className="bg-green-100 text-green-700 p-5 rounded-2xl shadow font-bold flex items-center justify-center gap-3">
                        <FaCheckCircle className="text-2xl" />
                        <span>
                            Today Opening Balance Already Added
                        </span>
                    </div>

                ) : (

                    <div className="bg-white p-6 rounded-2xl shadow">

                        <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
                            <FaUniversity className="text-blue-700" />
                            Opening Balance
                        </h2>

                        <div className="grid grid-cols-2 md:grid-cols-6 gap-4">

                            {[
                                "500",
                                "200",
                                "100",
                                "50",
                                "20",
                                "10",
                            ].map((note) => (

                                <input
                                    key={note}
                                    type="number"
                                    placeholder={`₹${note}`}
                                    value={opening[`note_${note}`]}
                                    onChange={(e) =>
                                        setOpening({
                                            ...opening,
                                            [`note_${note}`]:
                                                e.target.value,
                                        })
                                    }
                                    className="border rounded-xl p-4"
                                />

                            ))}

                        </div>

                        <button
                            onClick={handleOpening}
                            className="mt-5 bg-blue-900 hover:bg-blue-800 text-white px-6 py-3 rounded-xl font-bold"
                        >
                            Save Opening
                        </button>

                    </div>

                )
            }

            {/* ================= TRANSACTION FORM ================= */}

            <div className="bg-white rounded-2xl shadow p-6 mt-7 mb-8">

                <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
                    <FaPlusCircle className="text-green-600" />
                    Add Transaction
                </h2>

                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">

                    <input
                        type="text"
                        placeholder="Customer Name"
                        value={txn.customer_name}

                        onChange={(e) =>
                            setTxn({
                                ...txn,

                                customer_name:
                                    e.target.value,
                            })
                        }

                        className="border p-3 rounded-xl outline-none"
                    />

                    <select
                        value={txn.bank_name}

                        onChange={(e) =>
                            setTxn({
                                ...txn,

                                bank_name:
                                    e.target.value,
                            })
                        }

                        className="border p-3 rounded-xl outline-none"
                    >

                        <option value="">
                            Select Bank
                        </option>

                        <option value="SBI">
                            SBI
                        </option>

                        <option value="Maharashtra Bank">
                            Maharashtra Bank
                        </option>

                        <option value="Airtel Bank">
                            Airtel Bank
                        </option>

                    </select>

                    <select
                        value={txn.type}

                        onChange={(e) =>
                            setTxn({
                                ...txn,
                                type: e.target.value,
                            })
                        }

                        className="border p-3 rounded-xl outline-none"
                    >

                        <option value="">
                            Select Type
                        </option>

                        <option value="deposit">
                            Deposit
                        </option>

                        <option value="withdrawal">
                            Withdrawal
                        </option>

                    </select>
                </div>

                {/* NOTES */}

                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4 mt-5">

                    {[
                        "500",
                        "200",
                        "100",
                        "50",
                        "20",
                        "10",
                    ].map((note) => (

                        <input
                            key={note}
                            type="number"
                            placeholder={`₹${note}`}

                            value={
                                txn[`note_${note}`]
                            }

                            onChange={(e) =>
                                setTxn({
                                    ...txn,

                                    [`note_${note}`]:
                                        e.target.value,
                                })
                            }

                            className="border p-3 rounded-xl outline-none"
                        />
                    ))}
                </div>

                {/* TOTAL */}

                <div className="mt-6">

                    <h2 className="text-3xl font-bold text-green-600">
                        ₹ {transactionTotal}
                    </h2>

                </div>

                <button
                    onClick={handleTxn}
                    className="mt-5 bg-green-600 text-white px-6 py-3 rounded-xl font-bold"
                >
                    Submit Transaction
                </button>
            </div>

            {/* ================= TABLE ================= */}

            <div className="bg-white rounded-2xl shadow p-6">

                <h2 className="flex items-center gap-2 text-2xl font-bold mb-5">
                    <FaHistory className="text-purple-600" />
                    Transactions
                </h2>

                {/* FILTERS */}

                <div className="flex flex-col md:flex-row gap-4 mb-5">

                    <input
                        type="text"
                        placeholder="Search Customer"
                        value={search}

                        onChange={(e) =>
                            setSearch(e.target.value)
                        }

                        className="border p-3 rounded-xl outline-none w-full"
                    />

                    <select
                        value={bankFilter}

                        onChange={(e) =>
                            setBankFilter(
                                e.target.value
                            )
                        }

                        className="border p-3 rounded-xl outline-none"
                    >

                        <option value="">
                            All Banks
                        </option>

                        <option value="SBI">
                            SBI
                        </option>

                        <option value="Maharashtra Bank">
                            Maharashtra Bank
                        </option>

                        <option value="Airtel Bank">
                            Airtel Bank
                        </option>

                    </select>

                    <input
                        type="date"
                        value={selectedDate}
                        onChange={(e) =>
                            setSelectedDate(e.target.value)
                        }
                        className="border p-3 rounded-xl outline-none"
                    />
                </div>

                {/* TABLE */}

                <div className="overflow-x-auto">

                    <table className="w-full border-collapse">

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

                                <th className="p-4">
                                    Action
                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {filteredTransactions.map(
                                (item) => (

                                    <tr
                                        key={item.id}
                                        className="border-b"
                                    >

                                        <td className="p-4 text-center">
                                            {item.customer_name}
                                        </td>

                                        <td className="p-4 text-center">
                                            {item.bank_name}
                                        </td>

                                        <td
                                            className={`p-4 text-center font-bold ${item.type ===
                                                "deposit"
                                                ? "text-green-600"
                                                : "text-red-600"
                                                }`}
                                        >
                                            {item.type}
                                        </td>

                                        <td className="p-4 text-center">
                                            ₹ {item.amount}
                                        </td>

                                        <td className="p-4 text-center">

                                            {new Date(
                                                item.created_at
                                            ).toLocaleTimeString()}

                                        </td>

                                        <td className="p-4 text-center">

                                            <button
                                                onClick={() =>
                                                    handleDelete(item.id)
                                                }
                                                className="bg-red-500 hover:bg-red-600 text-white px-4 py-2 rounded-lg"
                                            >
                                                Delete
                                            </button>

                                        </td>

                                    </tr>
                                )
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

export default Transactions;