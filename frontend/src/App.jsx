import { useEffect, useState } from "react";
import toast, { Toaster } from "react-hot-toast";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API = "http://localhost:3000";

function App() {
  const [balance, setBalance] = useState(null);

  // ---------------- OPENING ----------------

  const [opening, setOpening] = useState({
    note_500: "",
    note_200: "",
    note_100: "",
    note_50: "",
    note_20: "",
    note_10: "",
  });

  // ---------------- TRANSACTION ----------------

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

  // ---------------- TRANSACTIONS ----------------

  const [transactions, setTransactions] = useState([]);

  const [search, setSearch] = useState("");

  // ---------------- GET BALANCE ----------------

  const getBalance = async () => {
    try {
      const res = await fetch(API + "/balance");

      const data = await res.json();

      if (res.ok) {
        setBalance(data);
      } else {
        setBalance(null);
      }
    } catch (err) {
      console.log(err);
    }
  };

  // ---------------- GET TRANSACTIONS ----------------

  const getTransactions = async () => {
    try {
      const res = await fetch(API + "/transactions");

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

  // ---------------- OPENING SAVE ----------------

  const handleOpening = async () => {
    try {
      const res = await fetch(API + "/opening", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          note_500: Number(opening.note_500 || 0),
          note_200: Number(opening.note_200 || 0),
          note_100: Number(opening.note_100 || 0),
          note_50: Number(opening.note_50 || 0),
          note_20: Number(opening.note_20 || 0),
          note_10: Number(opening.note_10 || 0),
        }),
      });

      const data = await res.json();

      if (res.ok) {
        toast.success("Opening Balance Added ✅");
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
        toast.error(data.message);
      }
    } catch (err) {
      toast.error("Something went wrong ❌");
    }
  };

  // ---------------- TRANSACTION ----------------

  const handleTxn = async () => {

    // ---------------- OPENING BALANCE CHECK ----------------

    if (!balance || totalCash <= 0) {

      toast("Add Opening Balance First ⚠️", {
        style: {
          background: "#facc15",
          color: "black",
          minWidth: "320px",
          maxWidth: "320px",
          padding: "16px 20px",
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      return;
    }

    // ---------------- VALIDATION ----------------

    if (!txn.customer_name) {
      toast("Enter Customer Name ⚠️", {
        style: {
          background: "#facc15",
          color: "black",
        },
      });

      return;
    }

    if (!txn.bank_name) {
      toast("Select Bank ⚠️", {
        style: {
          background: "#facc15",
          color: "black",
        },
      });

      return;
    }

    if (!txn.type) {
      toast("Select Transaction Type ⚠️", {
        style: {
          background: "#facc15",
          color: "black",
          minWidth: "320px",
          maxWidth: "320px",
          padding: "16px 20px",
          borderRadius: "14px",
          fontSize: "16px",
          fontWeight: "bold",
        },
      });

      return;
    }

    if (transactionTotal <= 0) {
      toast("Enter Notes Count ⚠️", {
        style: {
          background: "#facc15",
          color: "black",
        },
      });

      return;
    }

    try {
      const res = await fetch(API + "/transaction", {
        method: "POST",

        headers: {
          "Content-Type": "application/json",
        },

        body: JSON.stringify({
          customer_name: txn.customer_name,
          bank_name: txn.bank_name,
          type: txn.type,

          note_500: Number(txn.note_500 || 0),
          note_200: Number(txn.note_200 || 0),
          note_100: Number(txn.note_100 || 0),
          note_50: Number(txn.note_50 || 0),
          note_20: Number(txn.note_20 || 0),
          note_10: Number(txn.note_10 || 0),
        }),
      });

      const data = await res.json();

      if (res.ok) {

        if (txn.type === "deposit") {
          toast.success("Cash Deposited Successfully ✅");
        } else {
          toast.error("Cash Withdraw Successfully ❌");
        }

        getBalance();
        getTransactions();

        setTxn({
          customer_name: "",
          bank_name: "",
          type: "deposit",

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

      toast.error("Transaction Failed ❌");

    }
  };

  // ---------------- PDF DOWNLOAD ----------------

  const downloadPDF = () => {

    const doc = new jsPDF();

    // ================= HEADER =================

    doc.setFillColor(30, 60, 114);

    doc.rect(0, 0, 220, 30, "F");

    doc.setTextColor(255, 255, 255);

    doc.setFontSize(22);

    doc.text(
      "Daily Cash Management Report",
      45,
      20
    );

    // ================= DATE =================

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(12);
    doc.setCharSpace(0);

    doc.text(
      `Date : ${new Date().toLocaleDateString()}`,
      14,
      45
    );

    // ================= SUMMARY =================

    doc.setFillColor(22, 163, 74);

    doc.roundedRect(10, 55, 60, 22, 3, 3, "F");

    doc.setTextColor(255, 255, 255);

    doc.text(
      `Deposit : Rs ${Number(totalDeposit).toLocaleString("en-IN")}`,
      16,
      68
    );

    // Withdrawal

    doc.setFillColor(220, 38, 38);

    doc.roundedRect(75, 55, 60, 22, 3, 3, "F");

    doc.text(
      `Withdraw : Rs ${Number(totalWithdrawal).toLocaleString("en-IN")}`,
      81,
      68
    );

    // Balance

    doc.setFillColor(37, 99, 235);

    doc.roundedRect(140, 55, 60, 22, 3, 3, "F");

    doc.text(
      `Balance : Rs ${Number(totalCash).toLocaleString("en-IN")}`,
      146,
      68
    );


    // ================= NOTES =================

    doc.setTextColor(0, 0, 0);

    doc.setFontSize(13);

    doc.text("Notes Summary", 14, 85);

    doc.setFontSize(11);

    doc.text(
      `500 Notes : ${balance?.notes?.note_500 || 0}`,
      14,
      95
    );

    doc.text(
      `200 Notes : ${balance?.notes?.note_200 || 0}`,
      14,
      103
    );

    doc.text(
      `100 Notes : ${balance?.notes?.note_100 || 0}`,
      14,
      111
    );

    doc.text(
      `50 Notes : ${balance?.notes?.note_50 || 0}`,
      80,
      95
    );

    doc.text(
      `20 Notes : ${balance?.notes?.note_20 || 0}`,
      80,
      103
    );

    doc.text(
      `10 Notes : ${balance?.notes?.note_10 || 0}`,
      80,
      111
    );

    // ================= TABLE =================

    autoTable(doc, {

      startY: 125,

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
          `Rs  ${item.amount}`,
          new Date(
            item.created_at
          ).toLocaleTimeString(),
        ]
      ),

      theme: "grid",

      headStyles: {
        fillColor: [30, 60, 114],
        halign: "center",
        fontStyle: "bold",
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

    doc.save("cash-report.pdf");

    toast.success(
      "PDF Downloaded Successfully ✅"
    );
  };

  // ---------------- TOTAL CASH ----------------

  const totalCash = balance?.total_amount || 0;

  // ---------------- LIVE TOTAL ----------------

  const transactionTotal =
    Number(txn.note_500 || 0) * 500 +
    Number(txn.note_200 || 0) * 200 +
    Number(txn.note_100 || 0) * 100 +
    Number(txn.note_50 || 0) * 50 +
    Number(txn.note_20 || 0) * 20 +
    Number(txn.note_10 || 0) * 10;

  // ---------------- TOTALS ----------------

  const totalDeposit = transactions
    .filter((t) => t.type === "deposit")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  const totalWithdrawal = transactions
    .filter((t) => t.type === "withdrawal")
    .reduce((sum, item) => sum + Number(item.amount), 0);

  // ---------------- SEARCH ----------------

  const filteredTransactions = transactions.filter((item) =>
    item.customer_name
      .toLowerCase()
      .includes(search.toLowerCase())
  );

  return (
    <div
      style={{
        background: "#f4f7fb",
        minHeight: "100vh",
        padding: "20px",
        fontFamily: "Arial",
      }}
    >
      {/* TOASTER */}

      <Toaster
        position="bottom-right"
        toastOptions={{
          duration: 3000,

          style: {
            minWidth: "320px",
            maxWidth: "320px",
            padding: "16px 20px",
            borderRadius: "14px",
            fontSize: "16px",
            fontWeight: "bold",
            color: "white",
          },

          success: {
            style: {
              background: "#16a34a",
              color: "white",
            },
          },

          error: {
            style: {
              background: "#dc2626",
              color: "white",
            },
          },
        }}
      />

      {/* HEADER */}

      <div
        style={{
          background: "linear-gradient(90deg,#1e3c72,#2a5298)",
          color: "white",
          padding: "30px",
          borderRadius: "20px",
          marginBottom: "25px",
          textAlign: "center",
        }}
      >
        <h1
          style={{
            fontSize:
              window.innerWidth < 768
                ? "35px"
                : "65px",
            margin: 0,
          }}
        >
          💰 Cash Management System
        </h1>

        <p
          style={{
            marginTop: "10px",
            fontSize: "18px",
          }}
        >
          Daily Cash Counter Management
        </p>
      </div>

      {/* TOP CARDS */}

      <div
        style={{
          display: "grid",
          gridTemplateColumns:
            window.innerWidth < 768
              ? "1fr"
              : "repeat(4,minmax(250px,1fr))",

          gap: "20px",
          marginBottom: "20px",
        }}
      >
        {/* CURRENT CASH */}

        <div style={cardStyle}>
          <h2>💵 Current Cash</h2>

          <h1
            style={{
              color: "green",
              fontSize: "55px",
            }}
          >
            ₹ {totalCash}
          </h1>
        </div>

        {/* NOTES */}

        <div style={cardStyle}>
          <h2>🧾 Remaining Notes</h2>

          <p>₹500 : {balance?.notes?.note_500 || 0}</p>

          <p>₹200 : {balance?.notes?.note_200 || 0}</p>

          <p>₹100 : {balance?.notes?.note_100 || 0}</p>

          <p>₹50 : {balance?.notes?.note_50 || 0}</p>

          <p>₹20 : {balance?.notes?.note_20 || 0}</p>

          <p>₹10 : {balance?.notes?.note_10 || 0}</p>
        </div>

        {/* DEPOSIT */}

        <div style={cardStyle}>
          <h2 style={{ color: "green" }}>
            ✅ Deposit
          </h2>

          <h1 style={{ fontSize: "50px" }}>
            ₹ {totalDeposit}
          </h1>
        </div>

        {/* WITHDRAWAL */}

        <div style={cardStyle}>
          <h2 style={{ color: "red" }}>
            ❌ Withdrawal
          </h2>

          <h1 style={{ fontSize: "50px" }}>
            ₹ {totalWithdrawal}
          </h1>
        </div>
      </div>

      {/* OPENING */}

      {balance?.total_amount > 0 ? (
        <div
          style={{
            background: "#d4edda",
            color: "#155724",
            padding: "20px",
            borderRadius: "15px",
            marginBottom: "20px",
            fontWeight: "bold",
            textAlign: "center",
            fontSize: "18px",
          }}
        >
          ✅ Today Opening Balance Already Added
        </div>
      ) : (
        <div style={sectionStyle}>
          <h2>🏦 Opening Balance</h2>

          <div
            style={{
              display: "grid",

              gridTemplateColumns:
                window.innerWidth < 768
                  ? "repeat(2,1fr)"
                  : "repeat(6,1fr)",

              gap: "10px",
              marginTop: "15px",
            }}
          >
            {["500", "200", "100", "50", "20", "10"].map(
              (note) => (
                <input
                  key={note}
                  type="number"
                  placeholder={`Enter ₹${note} notes`}
                  value={opening[`note_${note}`]}
                  onChange={(e) =>
                    setOpening({
                      ...opening,
                      [`note_${note}`]:
                        e.target.value,
                    })
                  }
                  style={inputStyle}
                />
              )
            )}
          </div>

          <button
            onClick={handleOpening}
            style={{
              ...buttonStyle,
              background: "#1e3c72",
            }}
          >
            Save Opening
          </button>
        </div>
      )}

      {/* TRANSACTION */}

      <div style={sectionStyle}>
        <h2>🔄 Transaction</h2>

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              window.innerWidth < 768
                ? "1fr"
                : "1fr 1fr 1fr",

            gap: "10px",
            marginTop: "15px",
          }}
        >
          <input
            type="text"
            placeholder="Enter Customer Name"
            value={txn.customer_name}
            onChange={(e) =>
              setTxn({
                ...txn,
                customer_name: e.target.value,
              })
            }
            style={inputStyle}
          />

          <select
            value={txn.bank_name}
            onChange={(e) =>
              setTxn({
                ...txn,
                bank_name: e.target.value,
              })
            }
            style={selectStyle}
          >
            <option value="">
              Select Bank
            </option>

            <option value="SBI">SBI</option>

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
            style={selectStyle}
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

        <div
          style={{
            display: "grid",

            gridTemplateColumns:
              window.innerWidth < 768
                ? "repeat(2,1fr)"
                : "repeat(6,1fr)",

            gap: "10px",
            marginTop: "20px",
          }}
        >
          {["500", "200", "100", "50", "20", "10"].map(
            (note) => (
              <input
                key={note}
                type="number"
                placeholder={`₹${note} Count`}
                value={txn[`note_${note}`]}
                onChange={(e) =>
                  setTxn({
                    ...txn,
                    [`note_${note}`]:
                      e.target.value,
                  })
                }
                style={inputStyle}
              />
            )
          )}
        </div>

        {/* LIVE TOTAL */}

        <div
          style={{
            marginTop: "20px",
            background: "#eef5ff",
            padding: "20px",
            borderRadius: "15px",
            width:
              window.innerWidth < 768
                ? "100%"
                : "250px",
          }}
        >
          <h3>💵 Transaction Total</h3>

          <h1
            style={{
              color: "green",
              fontSize: "40px",
            }}
          >
            ₹ {transactionTotal}
          </h1>
        </div>

        <button
          onClick={handleTxn}
          style={{
            ...buttonStyle,

            background:
              txn.type === "deposit"
                ? "green"
                : "red",
          }}
        >
          Submit Transaction
        </button>
      </div>

      {/* TRANSACTIONS */}

      <div style={sectionStyle}>
        <h2
          style={{
            textAlign: "center",
          }}
        >
          📜 Today Transactions
        </h2>

        <div
          style={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "15px",
          }}
        >
          <button
            onClick={downloadPDF}
            style={{
              background: "#1e3c72",
              color: "white",
              border: "none",
              padding: "12px 18px",
              borderRadius: "10px",
              cursor: "pointer",
              fontWeight: "bold",
            }}
          >
            Download PDF
          </button>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "20px",
          }}
        >
          <input
            type="text"
            placeholder="Search Customer"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            style={{
              ...inputStyle,

              width:
                window.innerWidth < 768
                  ? "100%"
                  : "350px",
            }}
          />
        </div>

        <div
          style={{
            overflowX: "auto",
            width: "100%",
            marginTop: "25px",
          }}
        >
          <table
            style={{
              width: "100%",
              borderCollapse: "collapse",
              background: "white",
            }}
          >
            <thead>
              <tr
                style={{
                  background: "#1e3c72",
                  color: "white",
                }}
              >
                <th style={tableHead}>Customer</th>

                <th style={tableHead}>Bank</th>

                <th style={tableHead}>Type</th>

                <th style={tableHead}>Amount</th>

                <th style={tableHead}>Time</th>
              </tr>
            </thead>

            <tbody>
              {filteredTransactions.map((item) => (
                <tr key={item.id}>
                  <td style={tableData}>
                    {item.customer_name}
                  </td>

                  <td style={tableData}>
                    {item.bank_name}
                  </td>

                  <td
                    style={{
                      ...tableData,

                      color:
                        item.type === "deposit"
                          ? "green"
                          : "red",

                      fontWeight: "bold",
                    }}
                  >
                    {item.type}
                  </td>

                  <td style={tableData}>
                    ₹ {item.amount}
                  </td>

                  <td style={tableData}>
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
    </div>
  );
}

// ---------------- STYLES ----------------

const cardStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
  textAlign: "center",
};

const sectionStyle = {
  background: "white",
  padding: "25px",
  borderRadius: "20px",
  marginBottom: "20px",
  boxShadow: "0px 4px 15px rgba(0,0,0,0.08)",
};

const selectStyle = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
  background: "#ffffff",
  width: "100%",
  boxSizing: "border-box",

  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

  fontWeight: "600",

  color: "#1e293b",

  cursor: "pointer",
};

const inputStyle = {
  padding: "14px 16px",
  borderRadius: "14px",
  border: "1px solid #cbd5e1",
  fontSize: "15px",
  outline: "none",
  background: "#ffffff",
  width: "100%",
  boxSizing: "border-box",

  boxShadow: "0 2px 8px rgba(0,0,0,0.05)",

  transition: "0.3s",

  fontWeight: "500",

  color: "#1e293b",
};

const buttonStyle = {
  marginTop: "20px",
  padding: "14px 22px",
  border: "none",
  borderRadius: "12px",
  color: "white",
  cursor: "pointer",
  fontSize: "16px",
  fontWeight: "bold",
  boxShadow: "0px 4px 10px rgba(0,0,0,0.2)",
};

const tableHead = {
  padding: "16px",
  textAlign: "center",
};

const tableData = {
  padding: "16px",
  borderBottom: "1px solid #ddd",
  textAlign: "center",
};

export default App;