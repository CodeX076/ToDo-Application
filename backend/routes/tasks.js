const express = require("express");
const jwt = require("jsonwebtoken");
const Task = require("../models/Task"); // Import Task model
const User = require("../models/User"); // Import User model for validation
require("dotenv").config();

const router = express.Router();

// Middleware to check authentication
function authenticateToken(req, res, next) {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ message: "No token provided" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET || "secretkey");
    req.userId = decoded.userId;
    next();
  } catch (err) {
    return res.status(403).json({ message: "Invalid token" });
  }
}

// =====================
//  Get all tasks for logged-in user
// =====================
router.get("/", authenticateToken, async (req, res) => {
  try {
    const tasks = await Task.find({ user: req.userId }).sort({ createdAt: -1 });
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================
//  Add new task
// =====================
router.post("/", authenticateToken, async (req, res) => {
  try {
    const { title } = req.body;

    const newTask = new Task({
      user: req.userId,
      title,
      status: false,
    });

    await newTask.save();
    res.status(201).json(newTask);
  } catch (err) {
    console.error("Add Task Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================
//  Update task status
// =====================
router.put("/:id", authenticateToken, async (req, res) => {
  try {
    const { status } = req.body;
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.userId },
      { status },
      { new: true }
    );

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json(task);
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

// =====================
//  Delete task
// =====================
router.delete("/:id", authenticateToken, async (req, res) => {
  try {
    const task = await Task.findOneAndDelete({
      _id: req.params.id,
      user: req.userId,
    });

    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Server Error" });
  }
});

module.exports = router;
