import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";

function Login({ setUser, theme, toggleTheme }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  // ✅ Handle normal login
  const handleLogin = (e) => {
    e.preventDefault();
    if (!email || !password) {
      alert("Please enter email and password!");
      return;
    }
    const userData = { email };
    setUser(userData); // ✅ Calls the setUser function from App.js
    navigate("/");
  };

  // ✅ Handle Demo Login
  const handleDemoLogin = () => {
    const demoUser = { email: "demo@billwise.com" };
    setUser(demoUser);
    navigate("/");
  };

  return (
    <div className={`auth-page ${theme}`}>
      <header className="auth-header">
        <h1>💰 Billwise</h1>
        <button className="theme-btn" onClick={toggleTheme}>
          {theme === "light" ? "🌙 Dark" : "☀️ Light"}
        </button>
      </header>

      <div className="auth-container">
        <h2>Login</h2>
        <form onSubmit={handleLogin}>
          <input
            type="email"
            placeholder="Enter Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <input
            type="password"
            placeholder="Enter Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <button type="submit">Login</button>
        </form>

        <button className="demo-btn" onClick={handleDemoLogin}>
          Demo Login
        </button>

        <p className="switch-text">
          Don’t have an account?{" "}
          <Link to="/signup" className="link">
            Sign up here
          </Link>
        </p>
      </div>
    </div>
  );
}

export default Login;
