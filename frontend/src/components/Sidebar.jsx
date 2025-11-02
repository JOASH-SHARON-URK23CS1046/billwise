import React, { useState } from "react";
import "../styles.css";

export default function Sidebar({ groups, addGroup, activeGroup, setActiveGroup }) {
  const [newGroup, setNewGroup] = useState("");
  const [collapsed, setCollapsed] = useState(false); // Sidebar toggle state

  return (
    <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
      {/* ☰ Toggle Button */}
      <button className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
        ☰
      </button>

      {/* Sidebar Content */}
      <h3>
        <span role="img" aria-label="compass">🧭</span> {!collapsed && "Groups"}
      </h3>

      {!collapsed && (
        <>
          <div className="group-input">
            <input
              type="text"
              placeholder="Add Group..."
              value={newGroup}
              onChange={(e) => setNewGroup(e.target.value)}
            />
            <button onClick={() => { addGroup(newGroup); setNewGroup(""); }}>+</button>
          </div>

          <div className="group-list">
            {groups.map((g, i) => (
              <div
                key={i}
                className={`group-item ${activeGroup === g ? "active" : ""}`}
                onClick={() => setActiveGroup(g)}
              >
                {g}
              </div>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
