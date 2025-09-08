const express = require("express");
const cors = require("cors");
require("dotenv").config(); // Load environment variables from .env

const db = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// ✅ Use dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
