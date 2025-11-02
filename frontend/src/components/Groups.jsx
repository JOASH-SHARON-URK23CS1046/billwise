import React, { useState, useEffect } from "react";
import axios from "axios";
import "./styles.css";

function Groups({ user }) {
  const [groupName, setGroupName] = useState("");
  const [memberInput, setMemberInput] = useState("");
  const [members, setMembers] = useState([]);
  const [groups, setGroups] = useState([]);

  // Fetch user's groups
  useEffect(() => {
    if (user) {
      axios.get(`/api/groups/${user._id}`).then((res) => setGroups(res.data));
    }
  }, [user]);

  const addMember = () => {
    if (memberInput && !members.includes(memberInput)) {
      setMembers([...members, memberInput]);
      setMemberInput("");
    }
  };

  const createGroup = async () => {
    if (!groupName || members.length === 0) {
      alert("Please enter group name and add at least one member!");
      return;
    }

    const res = await axios.post("/api/groups", {
      name: groupName,
      members,
      createdBy: user._id,
    });

    setGroups([...groups, res.data]);
    setGroupName("");
    setMembers([]);
  };

  return (
    <div className="card-panel">
      <h2>Groups</h2>
      <input
        className="input"
        placeholder="Group Name"
        value={groupName}
        onChange={(e) => setGroupName(e.target.value)}
      />

      <div>
        <input
          className="input"
          placeholder="Add Member"
          value={memberInput}
          onChange={(e) => setMemberInput(e.target.value)}
        />
        <button className="btn-primary" onClick={addMember}>
          + Add Member
        </button>
      </div>

      <ul className="member-list">
        {members.map((m, idx) => (
          <li key={idx}>{m}</li>
        ))}
      </ul>

      <button className="btn-primary" onClick={createGroup}>
        ✅ Create Group
      </button>

      <h3>Existing Groups</h3>
      <ul className="member-list">
        {groups.map((g) => (
          <li key={g._id}>
            <strong>{g.name}</strong> — Members: {g.members.join(", ")}
          </li>
        ))}
      </ul>
    </div>
  );
}

export default Groups;
