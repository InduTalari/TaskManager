import React, { useState } from "react";
import { ToastContainer } from "react-toastify";
import Login from "./components/Login";
import Signup from "./components/Signup";
import Dashboard from "./components/Dashboard";
import "react-toastify/dist/ReactToastify.css";

function App() {
  const [view, setView] = useState("login");
  const [username, setUsername] = useState("");  // Add this

  const goToSignup = () => setView("signup");
  const goToLogin = () => setView("login");
  const goToDashboard = (user) => {
    setUsername(user);  // Save username
    setView("dashboard");
  };

  return (
    <>
      <ToastContainer position="top-center" />
      {view === "login" && (
        <Login onSwitch={goToSignup} onSuccess={goToDashboard} />
      )}
      {view === "signup" && (
        <Signup onSwitch={goToLogin} onSuccess={goToDashboard} />
      )}
      {view === "dashboard" && (
        <Dashboard username={username} onSignOut={goToLogin} />
      )}
    </>
  );
}
export default App;
