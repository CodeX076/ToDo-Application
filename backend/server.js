const express = require("express");
const cors = require("cors");
require("dotenv").config();

const db = require("./db");
const authRoutes = require("./routes/auth");
const taskRoutes = require("./routes/tasks");

const app = express();

// Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ CORS configuration for your deployed frontend
app.use(cors({
  origin: "https://to-do-application-green-ten.vercel.app ", // Replace with your Vercel frontend URL
  methods: ["GET", "POST", "PUT", "DELETE"],
  credentials: true
}));

// Routes
app.use("/auth", authRoutes);
app.use("/tasks", taskRoutes);

// Default route for testing
app.get("/", (req, res) => {
  res.send("Backend is working 🚀");
});

// Dynamic port for Render
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`🚀 Server running on port ${PORT}`));
