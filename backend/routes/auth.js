const express = require("express");
const router = express.Router();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const db = require("../db");

const SECRET = "todo_secret"; // You can change this to any strong string

// Register
router.post("/register", (req, res) => {
  const { username, email, password } = req.body;
  const hashed = bcrypt.hashSync(password, 10);

  db.query("INSERT INTO users (username, email, password) VALUES (?, ?, ?)",
    [username, email, hashed],
    (err) => {
      if (err) return res.status(500).json({ msg: "Error registering user" });
      res.json({ msg: "✅ User registered successfully" });
    });
});
console.log("✅ auth.js loaded");
// Login
router.post("/login", (req, res) => {
  const { email, password } = req.body;

  db.query("SELECT * FROM users WHERE email = ?", [email], (err, rows) => {
    if (err || rows.length === 0) return res.status(400).json({ msg: "User not found" });

    const user = rows[0];
    if (!bcrypt.compareSync(password, user.password)) {
      return res.status(400).json({ msg: "Invalid password" });
    }

    const token = jwt.sign({ id: user.id }, SECRET, { expiresIn: "1d" });
    res.json({ token, user: { id: user.id, username: user.username } });
  });
});

module.exports = router;
