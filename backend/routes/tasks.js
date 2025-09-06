const express = require("express");
const router = express.Router();
const db = require("../db");
const jwt = require("jsonwebtoken");

const SECRET = "todo_secret"; // same secret as in auth.js

// Middleware to check token
function verifyToken(req, res, next) {
  const authHeader = req.headers["authorization"];
  if (!authHeader) return res.status(401).json({ msg: "No token provided" });

  const token = authHeader.split(" ")[1];
  if (!token) return res.status(401).json({ msg: "Invalid token" });

  jwt.verify(token, SECRET, (err, decoded) => {
    if (err) return res.status(401).json({ msg: "Unauthorized" });
    console.log("✅ Decoded token:", decoded);
    req.userId = decoded.id;
    next();
  });
}

// ✅ GET all tasks for logged-in user
router.get("/", verifyToken, (req, res) => {
  db.query(
    "SELECT * FROM tasks WHERE user_id = ? ORDER BY position ASC, created_at DESC",
    [req.userId],
    (err, results) => {
      if (err) return res.status(500).json({ msg: "DB Error", error: err });
      res.json(results);
    }
  );
});
// ✅ Add new task
router.post("/", verifyToken, (req, res) => {
  const { title } = req.body;
  if (!title) return res.status(400).json({ msg: "Title is required" });

  console.log("👉 Adding task:", title, "for user:", req.userId);

  db.query(
    "INSERT INTO tasks (user_id, title, status, position) VALUES (?, ?, 0, 0)",
    [req.userId, title],
    (err, result) => {
      if (err) {
        console.error("❌ MySQL Insert Error:", err);  // 👈 ADD THIS
        return res.status(500).json({ msg: "DB Error", error: err });
      }
      res.json({
        id: result.insertId,
        title,
        status: 0,
        user_id: req.userId
      });
    }
  );
});


// ✅ Update task completion
router.put("/:id", verifyToken, (req, res) => {
  const { completed } = req.body;
  db.query(
    "UPDATE tasks SET status = ? WHERE id = ? AND user_id = ?",
    [completed ? 1 : 0, req.params.id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ msg: "DB Error", error: err });
      res.json({ msg: "Task updated" });
    }
  );
});

// ✅ Delete task
router.delete("/:id", verifyToken, (req, res) => {
  db.query(
    "DELETE FROM tasks WHERE id = ? AND user_id = ?",
    [req.params.id, req.userId],
    (err) => {
      if (err) return res.status(500).json({ msg: "DB Error", error: err });
      res.json({ msg: "Task deleted" });
    }
  );
});

module.exports = router;
