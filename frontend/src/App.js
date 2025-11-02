import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "./styles.css";

function App() {
  const [user, setUser] = useState(null);
  const [theme, setTheme] = useState("light");

  // Load saved user and theme on mount
  useEffect(() => {
    const savedUser = localStorage.getItem("user");
    const savedTheme = localStorage.getItem("theme");

    if (savedUser) setUser(JSON.parse(savedUser));
    if (savedTheme) setTheme(savedTheme);
  }, []);

  // Save theme whenever it changes
  useEffect(() => {
    localStorage.setItem("theme", theme);
  }, [theme]);

  // Theme toggle function
  const toggleTheme = () => {
    setTheme((prev) => (prev === "light" ? "dark" : "light"));
  };

  // Handle login (save user)
  const handleLogin = (userData) => {
    localStorage.setItem("user", JSON.stringify(userData));
    setUser(userData);
  };

  // Handle logout
  const handleLogout = () => {
    localStorage.removeItem("user");
    setUser(null);
  };

  return (
    <div className={`app ${theme}`}>
      <Router>
        <Routes>
          {/* If logged in, show Dashboard; else redirect to Login */}
          <Route
            path="/"
            element={
              user ? (
                <Dashboard
                  user={user}
                  onLogout={handleLogout}
                  theme={theme}
                  toggleTheme={toggleTheme}
                />
              ) : (
                <Navigate to="/login" />
              )
            }
          />

          {/* Login Page */}
          <Route
            path="/login"
            element={<Login setUser={handleLogin} theme={theme} toggleTheme={toggleTheme} />}
          />

          {/* Signup Page */}
          <Route
            path="/signup"
            element={<Signup setUser={handleLogin} theme={theme} toggleTheme={toggleTheme} />}
          />
        </Routes>
      </Router>
    </div>
  );
}

export default App;
