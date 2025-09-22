import React from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import Login from "./components/Login";
import Register from "./components/Register";
import Dashboard from "./components/Dashboard";
import Loader from "./components/Loader";

function App() {
    const [loading, setLoading] = useState(true);

  useEffect(() => {
    const wakeUpBackend = async () => {
      try {
        // Ping the health endpoint first to wake up the backend
        await fetch("https://todo-backend-735k.onrender.com");
      } catch (err) {
        console.error("Backend is not responding:", err);
      } finally {
        setLoading(false);
      }
    };

    wakeUpBackend();
  }, []);

  if (loading) {
    return <Loader />;
  }
  return (
    <Router>
      <Routes>
        {/* Default route → Login Page */}
        <Route path="/" element={<Navigate to="/login" />} />

        {/* Auth Pages */}  
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />

        {/* Dashboard */}
        <Route path="/dashboard" element={<Dashboard />} />
      </Routes>
    </Router>
  );
}

export default App;
