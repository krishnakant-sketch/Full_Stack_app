import React, { useEffect, useState } from "react";
import axios, { formToJSON } from "axios";
import {
  BrowserRouter,
  Link,
  Route,
  Router,
  Routes,
  useNavigate,
} from "react-router-dom";
import { jsPDF } from "jspdf";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import About from "./Components/About";
import Settings from "./Components/Settings";
import Form from "./Components/Form";

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

  const downloadPDF = () => {
    const doc = new jsPDF();
    const FormData = JSON.parse(localStorage.getItem("InvestmentFormData")) || {};
    doc.text("Form Data", 10, 10);
    doc.setFontSize(14);
    doc.text(`Name: ${FormData.name}`, 10, 20);
    doc.text(`Email: ${FormData.email}`, 10, 30);
    doc.text(`Investment Amount: ${FormData.investmentAmount}`, 10, 40);
    doc.text(`Tenure: ${FormData.tenure}`, 10, 50);
    doc.save("form_data.pdf");

  }

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

      <h4>Thanks for choosing us for your Investment Planning</h4>
      <p> Please fill out the form below to get started:</p>
      <Form />
      
      <h4> Based on the investment amount and tenure period!</h4> 
      <p>Here is the Investment Plan which will give you highest returns!</p>
      <button onClick={downloadPDF}>Download PDF</button>

      <button style={{ marginLeft: "10px"}} onClick={logout}>Logout</button>
    </div>
  );
}

export default Dashboard;
