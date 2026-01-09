import React from "react";
import "../CSS/Settings.css";
import Dashboard from "../Dashboard";
import { Link, Route, Router, Routes } from "react-router-dom";

function Settings() {

  const [name, setName] = React.useState("");
  const [email, setEmail] = React.useState("");

  
  return (
    <div className="settings-container">
      <h3>Settings</h3>
      <h4>Manage your application settings here.</h4>
      
      <nav>
            <Link to="/dashboard">Dashboard</Link> 
        </nav>
    </div>
  );
}

export default Settings;
