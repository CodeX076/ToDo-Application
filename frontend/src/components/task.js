const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "todo_secret";

// ✅ Middleware to verify token
function verifyToken(req, res, next) {
  const token = req.headers["authorization"]?.split(" ")[1];
  if (!token) return res.status(403).json({ msg: "No token provided" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized" });
    req.userId = decoded.id;
    next();
  });
}

// ✅ Get tasks
router.get("/", verifyToken, (req, res) => {
  db.query("SELECT * FROM tasks WHERE user_id = ? ORDER BY position ASC", [req.userId], (err, rows) => {
    if (err) return res.status(500).json({ msg: "Error fetching tasks" });
    res.json(rows);
  });
});

// ✅ Add task
router.post("/", verifyToken, (req, res) => {
  const { title } = req.body;
  db.query("INSERT INTO tasks (user_id, title, status, position) VALUES (?, ?, ?, ?)", 
    [req.userId, title, 0, 0],
    (err) => {
      if (err) return res.status(500).json({ msg: "Error adding task" });
      res.json({ msg: "Task added successfully" });
    });
});

// ✅ Toggle task status
router.put("/:id", verifyToken, (req, res) => {
  const { status } = req.body;
  db.query("UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?", 
    [status, req.params.id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ msg: "Error updating task" });
      res.json({ msg: "Task updated successfully" });
    });
});

// ✅ Delete task
router.delete("/:id", verifyToken, (req, res) => {
  db.query("DELETE FROM tasks WHERE id = ? AND user_id = ?", [req.params.id, req.userId], (err) => {
    if (err) return res.status(500).json({ msg: "Error deleting task" });
    res.json({ msg: "Task deleted successfully" });
  });
});

module.exports = router;
