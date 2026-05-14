import { useState } from "react";

import { Link } from "react-router-dom";

import {
    MdDashboard,
    MdMenu,
    MdClose,
} from "react-icons/md";

import {
    FaExchangeAlt,
    FaFilePdf,
    FaWallet,
    FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {

    const [open, setOpen] =
        useState(false);

    // ================= LOGOUT =================

    const handleLogout = () => {

        sessionStorage.removeItem(
            "isLoggedIn"
        );

        window.location.reload();
    };

    return (

        <>

            {/* ================= MOBILE TOPBAR ================= */}

            <div className="lg:hidden fixed top-0 left-0 w-full bg-[#1e3c72] text-white flex items-center justify-between px-5 py-4 z-50 shadow-lg">

                <h1 className="flex items-center gap-2 text-2xl font-bold">

                    <FaWallet className="text-yellow-400" />

                    CMS

                </h1>

                <button
                    onClick={() =>
                        setOpen(!open)
                    }
                    className="text-3xl"
                >

                    {
                        open
                            ? <MdClose />
                            : <MdMenu />
                    }

                </button>

            </div>

            {/* ================= OVERLAY ================= */}

            {
                open && (

                    <div
                        onClick={() =>
                            setOpen(false)
                        }
                        className="fixed inset-0 bg-black/50 z-40 lg:hidden"
                    />

                )
            }

            {/* ================= SIDEBAR ================= */}

            <div
                className={`fixed top-0 left-0 h-screen w-64 bg-[#1e3c72] text-white p-5 flex flex-col justify-between z-50 transform transition-transform duration-300

                ${open
                        ? "translate-x-0"
                        : "-translate-x-full"
                    }

                lg:translate-x-0`}
            >

                {/* TOP */}

                <div>

                    <h1 className="flex items-center gap-3 text-4xl font-bold text-white mb-10 mt-10 lg:mt-0">

                        <FaWallet className="text-yellow-400" />

                        CMS

                    </h1>

                    <div className="flex flex-col gap-4">

                        <Link
                            to="/"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
                        >

                            <MdDashboard />

                            Dashboard

                        </Link>

                        <Link
                            to="/transactions"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
                        >

                            <FaExchangeAlt />

                            Transactions

                        </Link>

                        <Link
                            to="/reports"
                            onClick={() =>
                                setOpen(false)
                            }
                            className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
                        >

                            <FaFilePdf />

                            Reports

                        </Link>

                    </div>

                </div>

                {/* LOGOUT */}

                <button
                    onClick={handleLogout}
                    className="flex items-center justify-center gap-3 bg-red-500 hover:bg-red-600 transition p-3 rounded-xl font-bold"
                >

                    <FaSignOutAlt />

                    Logout

                </button>

            </div>

        </>
    );
}

export default Sidebar;