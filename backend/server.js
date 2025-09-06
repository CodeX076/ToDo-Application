const express = require("express");
const cors = require("cors");

const db = require("./db"); 
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// ✅ Add these middlewares
app.use(cors());
app.use(express.json());  // <-- This is important for JSON body
app.use(express.urlencoded({ extended: true })); // Optional for form data

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// ✅ Default route for testing
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// Start Server
app.listen(5000, () => console.log("🚀 Server running on port 5000"));
