import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { motion } from "framer-motion";

export const BASE_URL = "https://todo-backend-735k.onrender.com";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault(); 
    try {
      const res = await axios.post(`${BASE_URL}/auth/login`, {
        email,
        password,
      });

      // This part will only run on a successful login (200 OK status)
      if (res.data.token) {
        localStorage.setItem("token", res.data.token);
        navigate("/dashboard");
      }
    } catch (err) {
      // Access the specific error message from the backend's response
      if (err.response && err.response.data && err.response.data.msg) {
        setError(err.response.data.msg);
      } else {
        // Fallback for unexpected errors
        setError("Login failed. An unexpected error occurred.");
      }
    }
  };

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-4">
      <h1 className="text-5xl font-extrabold text-blue-600 mb-6 tracking-wide">TaskWala</h1>
      
      <motion.div
        className="bg-white p-8 rounded-2xl shadow-xl w-full max-w-sm text-center transform transition-all duration-300 ease-in-out"
        initial={{ opacity: 0, y: -50 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, type: "spring" }}
      >
        <h2 className="text-3xl font-bold mb-2 text-gray-800">ToDo Application</h2>
        <p className="text-gray-500 mb-6">Login to manage your tasks smoothly</p>

        <form onSubmit={handleLogin}>
          <motion.input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            whileFocus={{ scale: 1.05 }}
          />
          <motion.input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            className="w-full px-4 py-3 mb-4 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all"
            whileFocus={{ scale: 1.05 }}
          />
          {error && <p className="text-red-500 text-sm mb-4">{error}</p>}
          <motion.button
            type="submit"
            className="w-full py-3 bg-blue-600 text-white rounded-lg font-bold transition-transform hover:bg-blue-700"
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.95 }}
          >
            Login
          </motion.button>
        </form>
        <p className="mt-4 text-gray-600">
          New here? <a href="/register" className="text-blue-500 hover:underline">Register Now</a>
        </p>
      </motion.div>
    </div>
  );
}

export default Login;
