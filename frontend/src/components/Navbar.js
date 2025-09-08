import React from "react";
import { useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import "./Navbar.css";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("token"); // Clear auth token
    navigate("/"); // Redirect to login page
  };

  return (
    <motion.nav
      className="navbar"
      initial={{ y: -50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, type: "spring" }}
    >
      <h3 className="navbar-title">TaskWala</h3>
      <button className="logout-btn" onClick={handleLogout}>
        Logout
      </button>
    </motion.nav>
  );
}

export default Navbar;
