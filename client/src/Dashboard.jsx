import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

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
    <div>
      <h2>Dashboard</h2>
      <p>{message}</p>
      <button onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
