import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";
import "./Login.css";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post("http://localhost:5000/auth/login", {
        email,
        password,
      });
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      } else {
        setError("Invalid Credentials");
      }
    } catch (err) {
      setError("Login failed. Check credentials.");
    }
  };

  return (
    <div className="login-container">
      
    
    
      <motion.div
        className="login-card"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h2 className="login-title">ToDo Application</h2>
        <p className="login-subtitle">Login to manage your tasks smoothly</p>

        <form onSubmit={handleLogin}>
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="input-field"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="input-field"
            whileFocus={{ scale: 1.05 }}
          />
          {error && <p className="error-text">{error}</p>}
          <motion.button
            type="submit"
            className="login-btn"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="register-link">
          New here? <a href="/register">Register Now</a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
