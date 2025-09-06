import React from "react";
import { Link } from "react-router-dom";
import "./Home.css";

function Home() {
  return (
    <div className="home-container">
      <h1>Welcome to the To-Do App</h1>
      <p>Manage your tasks easily and stay productive!</p>
      <div className="home-buttons">
        <Link to="/login" className="home-btn">Login</Link>
        <Link to="/register" className="home-btn">Register</Link>
      </div>
    </div>
  );
}

export default Home;
