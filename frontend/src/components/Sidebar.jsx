import { Link } from "react-router-dom";

import {
    MdDashboard,
} from "react-icons/md";

import {
    FaExchangeAlt,
    FaFilePdf,
    FaWallet,
    FaSignOutAlt,
} from "react-icons/fa";

function Sidebar() {

    // ================= LOGOUT =================

    const handleLogout = () => {

        localStorage.removeItem(
            "isLoggedIn"
        );

        window.location.reload();
    };

    return (

        <div className="w-64 h-screen bg-[#1e3c72] text-white fixed left-0 top-0 p-5 flex flex-col justify-between">

            {/* TOP */}

            <div>

                <h1 className="flex items-center gap-3 text-4xl font-bold text-white mb-10">

                    <FaWallet className="text-yellow-400" />

                    CMS

                </h1>

                <div className="flex flex-col gap-4">

                    <Link
                        to="/"
                        className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
                    >
                        <MdDashboard />
                        Dashboard
                    </Link>

                    <Link
                        to="/transactions"
                        className="flex items-center gap-3 bg-white/10 p-3 rounded-xl hover:bg-white/20 transition"
                    >
                        <FaExchangeAlt />
                        Transactions
                    </Link>

                    <Link
                        to="/reports"
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
                className="flex items-center gap-3 bg-red-500 hover:bg-red-600 transition p-3 rounded-xl font-bold"
            >

                <FaSignOutAlt />

                Logout

            </button>

        </div>
    );
}

export default Sidebar;