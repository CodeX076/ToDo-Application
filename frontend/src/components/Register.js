import React, { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import axios from "axios";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("https://todo-backend-735k.onrender.com/auth/register", {
        username,
        email,
        password,
      });
      setMessage(res.data.msg);

      // If registration successful, redirect to login after 1 sec
      if (res.data.msg === "Registration successful") {
        setTimeout(() => {
          navigate("/");
        }, 1000);
      }
    } catch (err) {
      // Check if the error response exists and has a message
      if (err.response && err.response.data && err.response.data.msg) {
        setMessage(err.response.data.msg);
      } else {
        setMessage("Registration Failed. An unexpected error occurred.");
      }
    }
  };

  return (
    <div
  className="register-container"
  style={{
    backgroundImage: 'url("https://images.unsplash.com/photo-1519389950473-47ba0277781c?auto=format&fit=crop&w=1600&q=80")',
    backgroundSize: "cover",
    backgroundPosition: "center"
  }}
>
      <div className="register-card">
        <h2 className="register-title">Create Account</h2>
        <p className="register-subtitle">Sign up to get started</p>

        <form onSubmit={handleRegister}>
          <input
            type="text"
            placeholder="Username"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="register-input"
          />
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="register-input"
          />
          <button type="submit" className="register-btn">
            Register
          </button>
        </form>

        {message && <p className="register-message">{message}</p>}

        <p className="switch-text">
          Already have an account? <Link to="/">Login here</Link>
        </p>
      </div>
    </div>
  );
}

export default Register;
