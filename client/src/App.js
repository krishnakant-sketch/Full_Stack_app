import React from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
  BrowserRouter,
} from "react-router-dom";
import Login from "./Login";
import Dashboard from "./Dashboard";
import Register from "./Register";
import Home from "./Components/Home";
import Profile from "./Components/Profile";
import About from "./Components/About";
import Settings from "./Components/Settings";

const PrivateRoute = ({ children }) => {
  const token = localStorage.getItem("token");
  return token ? children : <Navigate to="/" />;
};

function App() {
  return (
  
    <Router>
      <Routes>
        <Route path="/register" element={<Register />} />
        <Route path="/" element={<Login />} /> 
        <Route path="/dashboard" element={<Dashboard/>} />   
        <Route path="/home" element={<Home />} />
        <Route path="/profile" element={<Profile />} />
        <Route path="/about" element={<About />} />
        <Route path="/settings" element={<Settings />} />
        
      </Routes>
    </Router>
  );
}

export default App;
