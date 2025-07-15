import React, { useState, useEffect } from "react";
import Login from "./components/Login";
import SignUp from "./components/SignUp";
import Dashboard from "./components/Dashboard";

function App() {
  const [page, setPage] = useState("login");
  const [username, setUsername] = useState("");

  useEffect(() => {
    const token = localStorage.getItem("token");
    const user = JSON.parse(localStorage.getItem("user"));
    if (token && user) {
      setUsername(user.name);
      setPage("dashboard");
    }
  }, []);

  const handleLoginSuccess = (user) => {
    localStorage.setItem("user", JSON.stringify(user));
    setUsername(user.name); // 👈 Set username
    setPage("dashboard");
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setPage("login");
  };

  return (
    <>
      {page === "login" && (
        <Login onSwitch={() => setPage("signup")} onSuccess={handleLoginSuccess} />
      )}
      {page === "signup" && (
        <SignUp onSwitch={() => setPage("login")} onSuccess={handleLoginSuccess} />
      )}
      {page === "dashboard" && (
        <Dashboard username={username} onSignOut={handleLogout} />
      )}
    </>
  );
}

export default App;