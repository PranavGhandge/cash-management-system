import { useState } from "react";

import {
    FaUser,
    FaLock,
    FaWallet,
} from "react-icons/fa";

import toast, {
    Toaster,
} from "react-hot-toast";

function Login({ setIsLoggedIn }) {

    const [form, setForm] = useState({
        username: "",
        password: "",
    });

    const handleLogin = (e) => {

        e.preventDefault();

        if (
            form.username === "admin" &&
            form.password === "1234"
        ) {

            sessionStorage.setItem(
                "isLoggedIn",
                "true"
            );

            setIsLoggedIn(true);

            toast.success(
                "Login Success "
            );

        } else {

            toast.error(
                "Invalid Credentials "
            );
        }
    };

    return (

        <div className="min-h-screen bg-gradient-to-br from-[#1e3c72] via-[#2a5298] to-[#4facfe] flex items-center justify-center px-4 py-6">

            <Toaster
                position="top-right"

                toastOptions={{

                    duration: 3000,

                    style: {
                        minWidth: "280px",
                        maxWidth: "320px",
                        padding: "16px 20px",
                        borderRadius: "14px",
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

            <div className="bg-white/10 backdrop-blur-xl border border-white/20 w-full max-w-md p-6 sm:p-8 rounded-3xl shadow-2xl">

                {/* LOGO */}

                <div className="flex flex-col items-center mb-8">

                    <div className="bg-yellow-400 p-4 sm:p-5 rounded-full shadow-lg">

                        <FaWallet className="text-4xl sm:text-5xl text-[#1e3c72]" />

                    </div>

                    <h1 className="text-3xl sm:text-4xl font-bold text-white mt-5">
                        CMS
                    </h1>

                    <p className="text-white/80 mt-2 text-center text-sm sm:text-base">
                        Cash Management System
                    </p>

                </div>

                {/* FORM */}

                <form
                    onSubmit={handleLogin}
                    className="space-y-5"
                >

                    {/* USERNAME */}

                    <div className="relative">

                        <FaUser className="absolute top-4 left-4 text-white/70 text-sm sm:text-base" />

                        <input
                            type="text"
                            placeholder="Enter Username"
                            value={form.username}

                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    username:
                                        e.target.value,
                                })
                            }

                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-2xl pl-12 pr-4 py-3 text-sm sm:text-base outline-none focus:border-yellow-400 transition"
                        />

                    </div>

                    {/* PASSWORD */}

                    <div className="relative">

                        <FaLock className="absolute top-4 left-4 text-white/70 text-sm sm:text-base" />

                        <input
                            type="password"
                            placeholder="Enter Password"
                            value={form.password}

                            onChange={(e) =>
                                setForm({
                                    ...form,
                                    password:
                                        e.target.value,
                                })
                            }

                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/60 rounded-2xl pl-12 pr-4 py-3 text-sm sm:text-base outline-none focus:border-yellow-400 transition"
                        />

                    </div>

                    {/* BUTTON */}

                    <button
                        type="submit"
                        className="w-full bg-yellow-400 hover:bg-yellow-300 text-[#1e3c72] py-3 rounded-2xl font-bold text-base sm:text-lg transition shadow-lg"
                    >
                        Login
                    </button>

                </form>

                {/* FOOTER */}

                <p className="text-center text-white/70 text-xs sm:text-sm mt-8">
                    Secure Cash Management Dashboard
                </p>

            </div>

        </div>
    );
}

export default Login;