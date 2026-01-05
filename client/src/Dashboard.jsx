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
import "./CSS/Dashboard.css";
import { io } from "socket.io-client";
import { Outlet } from "react-router-dom";

function Dashboard() {
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const [goldRate, setGoldRate] = useState(null);
  useEffect(() => {
    fetch("https://www.goldapi.io/api/XAU/INR", {
      headers: {
        "x-access-token": "goldapi-abtui9smk0tevn1-io",
        "Content-Type": "application/json",
      },
    })
      .then((res) => res.json())
      .then((data) => setGoldRate(data))
      .catch((err) => console.error(err));
  }, []);

  // useEffect(() => {
  //   const socket = io("http://localhost:5000");
  //   socket.on("goldRateUpdate", (data) => {
  //     setGoldRate(data);
  //   });
  //   return () => socket.disconnect();
  // }, []);

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

  const Prom = () => {
    const prom = new Promise((resolve, reject) => {
      setTimeout(() => {
        resolve("Promise resolved");
      }, 1000);
    });
    prom.then((resp) => console.log(resp));
  };

  const downloadPDF = () => {
    const doc = new jsPDF();
    const FormData =
      JSON.parse(localStorage.getItem("InvestmentFormData")) || {};
    doc.text("Investment Details", 10, 10);
    doc.setFontSize(14);
    doc.text(`Name: ${FormData.name}`, 10, 20);
    doc.text(`Email: ${FormData.email}`, 10, 30);
    doc.text(`Investment Amount: ${FormData.investmentAmount}`, 10, 40);
    doc.text(`Tenure: ${FormData.tenure}`, 10, 50);
    doc.text(`Selected Plan: ${FormData.plan}`, 10, 60);
    doc.save("form_data.pdf");
  };

  const logout = () => {
    localStorage.removeItem("token");
    navigate("/");
  };

  return (
    <div className="dashboard-container">
      <h3>Welcome to the Dashboard</h3>
      <Link id="home" to="/home">
        Home
      </Link>{" "}
      |{" "}
      <Link id="profile" to="/profile">
        Profile
      </Link>{" "}
      |{" "}
      <Link id="about" to="/about">
        About
      </Link>{" "}
      |{" "}
      <Link id="settings" to="/settings">
        Settings
      </Link>
      <h4>Thanks for choosing us for your Investment Planning</h4>
      <p className="parent"> Please fill out the form below to get started:</p>
      <Form />
      <h4> Based on the investment amount and tenure period!</h4>
      <button onClick={downloadPDF}>Download PDF</button>
      <h3>Gold Rate</h3>{" "}
      <h4>
        {goldRate
          ? `Current Gold Rate: ₹${goldRate.price_gram_24k}`
          : "Loading..."}
      </h4>
      {/* <button style={{ marginLeft: "5px"}} onClick={Prom}>Test Promise</button> */}
      <button style={{ marginLeft: "30%" }} onClick={logout}>
        Logout
      </button>
    </div>
  );
}

export default Dashboard;
