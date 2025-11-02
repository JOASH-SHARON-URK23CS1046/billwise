import React, { useState } from "react";
import { Line } from "react-chartjs-2";
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from "chart.js";
import "../styles.css"; // ✅ Make sure this path points to your styles.css

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Title, Tooltip, Legend);

function Dashboard() {
  const [groups, setGroups] = useState([]);
  const [groupName, setGroupName] = useState("");
  const [members, setMembers] = useState([]);
  const [selectedGroup, setSelectedGroup] = useState("");
  const [expenses, setExpenses] = useState([]);
  const [memberName, setMemberName] = useState("");
  const [desc, setDesc] = useState("");
  const [amount, setAmount] = useState("");
  const [payer, setPayer] = useState("");
  const [splitWith, setSplitWith] = useState([]);

  // ➕ Add group
  const addGroup = () => {
    if (groupName && !groups.includes(groupName)) {
      setGroups([...groups, groupName]);
      setGroupName("");
    }
  };

  // ➕ Add member
  const addMember = () => {
    if (memberName && selectedGroup) {
      setMembers([...members, { name: memberName, group: selectedGroup }]);
      setMemberName("");
    } else {
      alert("Please enter a member name and select a group!");
    }
  };

  // ➕ Add expense
  const addExpense = () => {
    if (desc && amount && payer && splitWith.length > 0) {
      const newExpense = { desc, amount: parseFloat(amount), payer, splitWith };
      setExpenses([...expenses, newExpense]);
      setDesc("");
      setAmount("");
      setPayer("");
      setSplitWith([]);
    } else {
      alert("Please fill all fields before adding an expense!");
    }
  };

  // 💰 Calculate total balance per member
  const totals = {};
  members.forEach((m) => (totals[m.name] = 0));

  expenses.forEach((exp) => {
    const share = exp.amount / exp.splitWith.length;
    exp.splitWith.forEach((member) => {
      if (member === exp.payer) {
        totals[member] += exp.amount - share; // payer’s net gain (paid minus their own share)
      } else {
        totals[member] -= share; // others owe their share
      }
    });
  });

  // 📊 Line chart data
  const chartData = {
    labels: expenses.map((e) => e.desc),
    datasets: [
      {
        label: "Expense Trend (₹)",
        data: expenses.map((e) => e.amount),
        borderColor: "#007bff",
        backgroundColor: "rgba(0, 123, 255, 0.3)",
        tension: 0.3,
      },
    ],
  };

  // 📦 Download dataset as CSV
  const downloadDataset = () => {
    if (expenses.length === 0) {
      alert("No data to download!");
      return;
    }

    let csvContent = "data:text/csv;charset=utf-8,Description,Payer,Amount,Split With\n";
    expenses.forEach((e) => {
      csvContent += `${e.desc},${e.payer},${e.amount},"${e.splitWith.join(", ")}"\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "billwise_dataset.csv");
    document.body.appendChild(link);
    link.click();
  };

  return (
    <div>
      <header className="header">
        💰 Smart Bill Splitter
        <small>Add groups, members, record expenses, and view settlements instantly.</small>
      </header>

      <div className="dashboard">
        {/* 🏷 Groups */}
        <div className="card-panel">
          <h2>Groups</h2>
          <input
            className="input"
            placeholder="Enter group name"
            value={groupName}
            onChange={(e) => setGroupName(e.target.value)}
          />
          <button className="btn-primary" onClick={addGroup}>
            + Add Group
          </button>
          <ol className="member-list">
            {groups.map((g, i) => (
              <li key={i}>{g}</li>
            ))}
          </ol>
        </div>

        {/* 👥 Members */}
        <div className="card-panel">
          <h2>Members</h2>
          <select
            className="input"
            value={selectedGroup}
            onChange={(e) => setSelectedGroup(e.target.value)}
          >
            <option value="">Select Group</option>
            {groups.map((g, i) => (
              <option key={i}>{g}</option>
            ))}
          </select>
          <input
            className="input"
            placeholder="Add new member"
            value={memberName}
            onChange={(e) => setMemberName(e.target.value)}
          />
          <button className="btn-primary" onClick={addMember}>
            + Add Member
          </button>
          <ol className="member-list">
            {members.map((m, idx) => (
              <li key={idx}>
                {m.name} <small>({m.group})</small>
              </li>
            ))}
          </ol>
        </div>

        {/* 💵 Add Expense */}
        <div className="card-panel">
          <h2>Add Expense</h2>
          <input
            className="input"
            placeholder="Expense Description"
            value={desc}
            onChange={(e) => setDesc(e.target.value)}
          />
          <input
            className="input"
            type="number"
            placeholder="Amount (₹)"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
          />
          <select
            className="input"
            value={payer}
            onChange={(e) => setPayer(e.target.value)}
          >
            <option value="">Select Payer</option>
            {members.map((m, i) => (
              <option key={i}>{m.name}</option>
            ))}
          </select>

          <div className="split-section">
            <p>Split with:</p>
            <div className="split-list">
              {members.map((m) => (
                <label key={m.name}>
                  <input
                    type="checkbox"
                    checked={splitWith.includes(m.name)}
                    onChange={() =>
                      setSplitWith((prev) =>
                        prev.includes(m.name)
                          ? prev.filter((x) => x !== m.name)
                          : [...prev, m.name]
                      )
                    }
                  />
                  {m.name}
                </label>
              ))}
            </div>
          </div>
          <button className="btn-primary" onClick={addExpense}>
            Add Expense
          </button>
          {expenses.length === 0 && <p className="empty-text">No expenses yet</p>}
        </div>

        {/* 📋 Summary */}
        <div className="card-panel summary">
          <h2>Summary</h2>
          {Object.keys(totals).length > 0 ? (
            Object.entries(totals).map(([member, balance]) => (
              <p key={member}>
                {member}:{" "}
                <strong style={{ color: balance >= 0 ? "green" : "red" }}>
                  ₹{balance.toFixed(2)}
                </strong>
              </p>
            ))
          ) : (
            <p className="empty-text">No members yet</p>
          )}
        </div>
      </div>

      {/* 📈 Line Chart */}
      {expenses.length > 0 && (
        <div className="chart-container">
          <h2 style={{ textAlign: "center", color: "#007bff" }}>Expense Overview</h2>
          <Line data={chartData} />
          <div style={{ textAlign: "center", marginTop: "16px" }}>
            <button className="download-btn" onClick={downloadDataset}>
              ⬇️ Download Dataset (CSV)
            </button>
          </div>
        </div>
      )}
    </div>
  );
}

export default Dashboard;
