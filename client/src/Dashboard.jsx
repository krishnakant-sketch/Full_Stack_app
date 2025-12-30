import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import About from "./Components/About";
import Settings from "./Components/Settings";

import { Outlet } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) {
      navigate("/"); // redirect if not logged in
    } else {
      axios
        .get("http://localhost:4000/dashboard", {
          headers: { Authorization: `Bearer ${token}` },
        })
        .then((res) => setMessage("Hello User"))
        .catch(() => {
          alert("Session expired");
          localStorage.removeItem("token");
          navigate("/");
        });
    }
  }, [navigate]);

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h3>Welcome to the Dashboard</h3>
      <Link to="/home">Home</Link> | {" "}
      <Link to="/profile">Profile</Link> | {" "}
      <Link to="/about">About</Link> | {" "}
      <Link to="/settings">Settings</Link>

      <p>{message}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
