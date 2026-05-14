import {
  BrowserRouter,
  Routes,
  Route,
} from "react-router-dom";

import {
  useEffect,
  useState,
} from "react";

import Sidebar from "./components/Sidebar";

import Dashboard from "./pages/Dashboard";
import Transactions from "./pages/Transactions";
import Reports from "./pages/Reports";
import Login from "./pages/Login";

const API = "http://localhost:3000";

function App() {

  // ================= LOGIN =================

  const [isLoggedIn, setIsLoggedIn] =
    useState(
      sessionStorage.getItem("isLoggedIn")
      === "true"
    );

  // ================= STATES =================

  const [balance, setBalance] =
    useState(null);

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

  // ================= LOAD =================

  useEffect(() => {

    if (isLoggedIn) {

      getBalance();

      getTransactions();

    }

  }, [isLoggedIn]);

  // ================= AUTO LOGOUT =================

  useEffect(() => {

    let timer;

    const resetTimer = () => {

      clearTimeout(timer);

      timer = setTimeout(() => {

        sessionStorage.removeItem(
          "isLoggedIn"
        );

        setIsLoggedIn(false);

      }, 10 * 60 * 1000);

    };

    window.addEventListener(
      "mousemove",
      resetTimer
    );

    window.addEventListener(
      "keydown",
      resetTimer
    );

    window.addEventListener(
      "click",
      resetTimer
    );

    resetTimer();

    return () => {

      clearTimeout(timer);

      window.removeEventListener(
        "mousemove",
        resetTimer
      );

      window.removeEventListener(
        "keydown",
        resetTimer
      );

      window.removeEventListener(
        "click",
        resetTimer
      );
    };

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

  // ================= LOGIN PAGE =================

  if (!isLoggedIn) {

    return (
      <Login
        setIsLoggedIn={setIsLoggedIn}
      />
    );
  }

  // ================= MAIN APP =================

  return (

    <BrowserRouter>

      <div className="bg-[#f4f7fb] min-h-screen">

        {/* SIDEBAR */}

        <Sidebar />

        {/* MAIN CONTENT */}

        <div className="lg:ml-64 p-4 sm:p-6">

          <Routes>

            {/* DASHBOARD */}

            <Route
              path="/"
              element={
                <Dashboard
                  balance={balance}
                  transactions={transactions}
                  totalCash={totalCash}
                  totalDeposit={totalDeposit}
                  totalWithdrawal={
                    totalWithdrawal
                  }
                />
              }
            />

            {/* TRANSACTIONS */}

            <Route
              path="/transactions"
              element={
                <Transactions
                  balance={balance}
                  setBalance={setBalance}
                  transactions={transactions}
                  setTransactions={
                    setTransactions
                  }
                  getBalance={getBalance}
                  getTransactions={
                    getTransactions
                  }
                />
              }
            />

            {/* REPORTS */}

            <Route
              path="/reports"
              element={
                <Reports
                  transactions={transactions}
                  totalDeposit={
                    totalDeposit
                  }
                  totalWithdrawal={
                    totalWithdrawal
                  }
                  totalCash={totalCash}
                  balance={balance}
                />
              }
            />

          </Routes>

        </div>

      </div>

    </BrowserRouter>
  );
}

export default App;