const mysql = require("mysql2");
require("dotenv").config();

const db = mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME,
  port: process.env.DB_PORT,
});
db.connect(err => {
  if (err) throw err;
  console.log("✅ MySQL Connected...");

  // ✅ Create tables safely (only if not exists)
  const createUsersTable = `
    CREATE TABLE IF NOT EXISTS users (
      id INT AUTO_INCREMENT PRIMARY KEY,
      username VARCHAR(100) NOT NULL,
      email VARCHAR(100) UNIQUE NOT NULL,
      password VARCHAR(255) NOT NULL,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
    )`;

  const createTasksTable = `
    CREATE TABLE IF NOT EXISTS tasks (
      id INT AUTO_INCREMENT PRIMARY KEY,
      user_id INT NOT NULL,
      title VARCHAR(255) NOT NULL,
      status TINYINT(1) NOT NULL DEFAULT 0,
      position INT DEFAULT 0,
      created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
      FOREIGN KEY (user_id) REFERENCES users(id) ON DELETE CASCADE
    )`;

  db.query(createUsersTable, err => {
    if (err) console.error("❌ Error creating users table:", err);
    else console.log("✅ Users table ready");
  });

  db.query(createTasksTable, err => {
    if (err) console.error("❌ Error creating tasks table:", err);
    else console.log("✅ Tasks table ready");
  });
});

module.exports = db;
