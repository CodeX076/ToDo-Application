import React from "react";
import "./Loader.css"; // We'll create this CSS file next

const Loader = () => {
  return (
    <div className="loader-container">
      <div className="loader-spinner"></div>
      <h2 className="loader-text">Waking up the server... Please wait 🚀</h2>
    </div>
  );
};

export default Loader;
