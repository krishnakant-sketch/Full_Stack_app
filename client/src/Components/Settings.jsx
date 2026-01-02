import React from "react";
import "../CSS/Settings.css";
import Dashboard from "../Dashboard";
import { Link, Route, Router, Routes } from "react-router-dom";

function Settings() {
  return (
    <div className="settings-container">
      <h3>Settings</h3>
      <p>This is the settings section.</p>
        <nav>
            <Link to="/dashboard">Dashboard</Link> | {" "}
        </nav>
      

      <a href="/dashboard">Go to Dashboard</a>
    </div>
  );
}

export default Settings;
